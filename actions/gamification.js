"use server";

import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Helper to get the current date midnight
 */
const getMidnight = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Track daily activity and update streaks/xp
 */
export async function trackDailyActivity() {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, streak_days, xp_points, last_activity")
      .eq("clerk_user_id", userId)
      .single();

    if (userError || !user) return { success: false, error: "User not found" };

    const now = new Date();
    const todayMidnight = getMidnight(now);
    
    // If no last activity, start streak
    if (!user.last_activity) {
      await supabase
        .from("users")
        .update({
          streak_days: 1,
          xp_points: user.xp_points + 10,
          last_activity: now.toISOString(),
        })
        .eq("id", user.id);
      return { success: true, updated: true, streakDays: 1, xpPoints: user.xp_points + 10 };
    }

    const lastActivityMidnight = getMidnight(new Date(user.last_activity));
    const diffTime = Math.abs(todayMidnight.getTime() - lastActivityMidnight.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Already active today
    if (diffDays === 0) {
      return { success: true, updated: false, streakDays: user.streak_days, xpPoints: user.xp_points };
    }

    // Active yesterday (Streak continues)
    if (diffDays === 1) {
      const newStreak = user.streak_days + 1;
      const newXp = user.xp_points + 10;
      await supabase
        .from("users")
        .update({
          streak_days: newStreak,
          xp_points: newXp,
          last_activity: now.toISOString(),
        })
        .eq("id", user.id);
      return { success: true, updated: true, streakDays: newStreak, xpPoints: newXp };
    }

    // Missed a day or more (Streak breaks)
    const newXpAfterBreak = user.xp_points + 5;
    await supabase
      .from("users")
      .update({
        streak_days: 1,
        xp_points: newXpAfterBreak, // Give some points just for coming back
        last_activity: now.toISOString(),
      })
      .eq("id", user.id);
    
    return { success: true, updated: true, streakDays: 1, xpPoints: newXpAfterBreak, broken: true };

  } catch (error) {
    console.error("Error tracking daily activity:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Helper to abbreviate name
 */
function abbreviateName(name) {
  if (!name) return "Anonymous";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
}

/**
 * Get Leaderboard data
 */
export async function getLeaderboard() {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    // Get top 10 users by xp_points
    const { data: topUsers, error: topError } = await supabase
      .from("users")
      .select("id, clerk_user_id, name, image_url, xp_points, streak_days, level")
      .order("xp_points", { ascending: false })
      .limit(10);

    if (topError) throw new Error(topError.message);

    // Format top users
    const formattedTopUsers = topUsers.map((u, index) => ({
      ...u,
      rank: index + 1,
      displayName: abbreviateName(u.name),
      isCurrentUser: u.clerk_user_id === userId
    }));

    // Find current user rank
    let currentUserRank = formattedTopUsers.find(u => u.isCurrentUser);
    
    if (!currentUserRank) {
      // If user is not in top 10, find their actual rank
      const { data: currentUser, error: currentError } = await supabase
        .from("users")
        .select("id, clerk_user_id, name, image_url, xp_points, streak_days, level")
        .eq("clerk_user_id", userId)
        .single();

      if (currentUser && !currentError) {
        const { count, error: countError } = await supabase
          .from("users")
          .select("*", { count: 'exact', head: true })
          .gt("xp_points", currentUser.xp_points);
        
        currentUserRank = {
          ...currentUser,
          rank: (count || 0) + 1,
          displayName: abbreviateName(currentUser.name),
          isCurrentUser: true
        };
      }
    }

    return { 
      success: true, 
      topUsers: formattedTopUsers,
      currentUserRank
    };

  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return { success: false, error: error.message };
  }
}
