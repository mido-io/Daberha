"use server";

import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeDecimal = (obj) => {
  const serialized = { ...obj };
  if (obj.target_amount !== undefined) serialized.targetAmount = Number(obj.target_amount);
  if (obj.current_amount !== undefined) serialized.currentAmount = Number(obj.current_amount);
  return serialized;
};

// Internal helper to get DB user ID
async function getDbUserId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { data: user, error } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (error || !user) throw new Error("User not found");
  return user.id;
}

export async function createGoal(data) {
  try {
    const userId = await getDbUserId();

    const { data: newGoal, error } = await supabase
      .from("goals")
      .insert([
        {
          name: data.name,
          target_amount: data.targetAmount,
          deadline: data.deadline,
          emoji: data.emoji,
          type: data.isShared ? 'SHARED' : 'PERSONAL',
          owner_id: userId,
        },
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);

    revalidatePath("/goals");
    revalidatePath("/dashboard");
    return { success: true, data: newGoal };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getUserGoals() {
  try {
    const userId = await getDbUserId();

    // Get goals where user is owner
    const { data: ownedGoals, error: ownedError } = await supabase
      .from("goals")
      .select("*")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false });

    if (ownedError) throw new Error(ownedError.message);

    // Get goals where user is a member (shared with me)
    const { data: memberRecords, error: memberError } = await supabase
      .from("goal_members")
      .select("goal_id, role, goals(*)")
      .eq("user_id", userId);

    if (memberError) throw new Error(memberError.message);

    const sharedGoals = memberRecords.map(m => ({ ...m.goals, memberRole: m.role }));

    return {
      success: true,
      data: {
        owned: ownedGoals.map(serializeDecimal),
        shared: sharedGoals.map(serializeDecimal),
      },
    };
  } catch (error) {
    console.error("Error fetching goals:", error);
    return { success: false, error: error.message };
  }
}

export async function getGoal(goalId) {
  try {
    const userId = await getDbUserId();

    const { data: goal, error } = await supabase
      .from("goals")
      .select(`
        *,
        goal_members (
          user_id,
          role,
          users ( name, email, image_url )
        )
      `)
      .eq("id", goalId)
      .single();

    if (error || !goal) throw new Error("Goal not found");

    // Check access
    const isOwner = goal.owner_id === userId;
    const membership = goal.goal_members?.find(m => m.user_id === userId);
    
    if (!isOwner && !membership) {
      throw new Error("Unauthorized to view this goal");
    }

    const role = isOwner ? 'OWNER' : membership.role;

    return {
      success: true,
      data: {
        ...serializeDecimal(goal),
        userRole: role,
        members: goal.goal_members,
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateGoalProgress(goalId, amountToAdd) {
  try {
    const userId = await getDbUserId();

    // Verify access and role (must be OWNER or EDITOR)
    const { data: goal, error: goalError } = await supabase
      .from("goals")
      .select("*, goal_members(user_id, role)")
      .eq("id", goalId)
      .single();

    if (goalError || !goal) throw new Error("Goal not found");

    const isOwner = goal.owner_id === userId;
    const membership = goal.goal_members?.find(m => m.user_id === userId);
    const role = isOwner ? 'OWNER' : (membership?.role || 'NONE');

    if (role !== 'OWNER' && role !== 'EDITOR') {
      throw new Error("You do not have permission to edit this goal's progress");
    }

    const newAmount = Number(goal.current_amount) + Number(amountToAdd);
    const status = newAmount >= Number(goal.target_amount) ? 'COMPLETED' : 'ACTIVE';

    const { data: updatedGoal, error: updateError } = await supabase
      .from("goals")
      .update({ current_amount: newAmount, status })
      .eq("id", goalId)
      .select()
      .single();

    if (updateError) throw new Error(updateError.message);

    revalidatePath(`/goals/${goalId}`);
    revalidatePath("/goals");
    revalidatePath("/dashboard");

    return { success: true, data: serializeDecimal(updatedGoal) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function inviteUserToGoal(goalId, email, role) {
  try {
    const userId = await getDbUserId();

    // Must be owner to invite
    const { data: goal, error: goalError } = await supabase
      .from("goals")
      .select("owner_id, type")
      .eq("id", goalId)
      .single();

    if (goalError || !goal) throw new Error("Goal not found");
    if (goal.owner_id !== userId) throw new Error("Only the goal owner can invite members");

    // Find user by email
    const { data: invitedUser, error: findError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (findError || !invitedUser) throw new Error("User with this email not found in Daberha");
    if (invitedUser.id === userId) throw new Error("You cannot invite yourself");

    // Add to goal_members
    const { error: inviteError } = await supabase
      .from("goal_members")
      .upsert({
        goal_id: goalId,
        user_id: invitedUser.id,
        role: role // 'VIEWER' or 'EDITOR'
      }, { onConflict: 'goal_id, user_id' });

    if (inviteError) throw new Error(inviteError.message);

    // If goal was PERSONAL, make it SHARED
    if (goal.type === 'PERSONAL') {
      await supabase
        .from("goals")
        .update({ type: 'SHARED' })
        .eq("id", goalId);
    }

    revalidatePath(`/goals/${goalId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
