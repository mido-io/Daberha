"use server";

import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getCurrentBudget(accountId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_user_id", userId)
      .single();

    if (userError || !user) {
      throw new Error("User not found");
    }

    const { data: budget, error: budgetError } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (budgetError) {
      console.error("Error fetching budget:", budgetError);
    }

    // Get current month's expenses
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).toISOString();
    
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
      23, 59, 59, 999
    ).toISOString();

    let query = supabase
      .from("transactions")
      .select("amount")
      .eq("user_id", user.id)
      .eq("type", "EXPENSE")
      .gte("date", startOfMonth)
      .lte("date", endOfMonth);

    if (accountId) {
      query = query.eq("account_id", accountId);
    }

    const { data: expensesData, error: expensesError } = await query;

    if (expensesError) {
      console.error("Error fetching expenses:", expensesError);
    }

    const totalExpenses = expensesData
      ? expensesData.reduce((sum, tx) => sum + Number(tx.amount), 0)
      : 0;

    return {
      budget: budget ? {
        ...budget,
        amount: Number(budget.amount),
        userId: budget.user_id,
        createdAt: budget.created_at,
        updatedAt: budget.updated_at,
      } : null,
      currentExpenses: totalExpenses,
    };
  } catch (error) {
    console.error("Error fetching budget:", error);
    throw error;
  }
}

export async function updateBudget(amount) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_user_id", userId)
      .single();

    if (userError || !user) throw new Error("User not found");

    // Update or create budget
    const { data: budget, error: budgetError } = await supabase
      .from("budgets")
      .upsert(
        {
          user_id: user.id,
          amount,
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (budgetError) throw new Error(budgetError.message);

    revalidatePath("/dashboard");
    return {
      success: true,
      data: {
        ...budget,
        amount: Number(budget.amount),
        userId: budget.user_id,
        createdAt: budget.created_at,
        updatedAt: budget.updated_at,
      },
    };
  } catch (error) {
    console.error("Error updating budget:", error);
    return { success: false, error: error.message };
  }
}