"use server";

import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeDecimal = (obj) => {
  const serialized = { ...obj };
  if (obj.balance !== undefined) {
    serialized.balance = Number(obj.balance);
  }
  if (obj.amount !== undefined) {
    serialized.amount = Number(obj.amount);
  }
  return serialized;
};

export async function getAccountWithTransactions(accountId) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (userError || !user) throw new Error("User not found");

  const { data: account, error: accountError } = await supabase
    .from("accounts")
    .select(`
      *,
      transactions (*)
    `)
    .eq("id", accountId)
    .eq("user_id", user.id)
    .order("date", { referencedTable: "transactions", ascending: false })
    .single();

  if (accountError || !account) return null;

  // Emulate _count for compatibility with frontend
  const accountWithCount = {
    ...account,
    userId: account.user_id, // map snake_case to camelCase
    isDefault: account.is_default,
    createdAt: account.created_at,
    updatedAt: account.updated_at,
    _count: {
      transactions: account.transactions ? account.transactions.length : 0,
    },
  };

  return {
    ...serializeDecimal(accountWithCount),
    transactions: (account.transactions || []).map((t) =>
      serializeDecimal({
        ...t,
        userId: t.user_id,
        accountId: t.account_id,
        isRecurring: t.is_recurring,
        recurringInterval: t.recurring_interval,
        nextRecurringDate: t.next_recurring_date,
        lastProcessed: t.last_processed,
        receiptUrl: t.receipt_url,
        createdAt: t.created_at,
        updatedAt: t.updated_at,
      })
    ),
  };
}

export async function bulkDeleteTransactions(transactionIds) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_user_id", userId)
      .single();

    if (userError || !user) throw new Error("User not found");

    // Call our RPC function for atomic bulk delete and balance updates
    const { data, error } = await supabase.rpc("bulk_delete_transactions_rpc", {
      p_transaction_ids: transactionIds,
      p_user_id: user.id,
    });

    if (error) throw new Error(error.message);

    revalidatePath("/dashboard");
    revalidatePath("/account/[id]");

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateDefaultAccount(accountId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_user_id", userId)
      .single();

    if (userError || !user) throw new Error("User not found");

    // Unset any existing default account
    const { error: unsetError } = await supabase
      .from("accounts")
      .update({ is_default: false })
      .eq("user_id", user.id)
      .eq("is_default", true);

    if (unsetError) throw new Error(unsetError.message);

    // Set the new default account
    const { data: account, error: setError } = await supabase
      .from("accounts")
      .update({ is_default: true })
      .eq("id", accountId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (setError) throw new Error(setError.message);

    revalidatePath("/dashboard");
    return {
      success: true,
      data: serializeDecimal({
        ...account,
        userId: account.user_id,
        isDefault: account.is_default,
        createdAt: account.created_at,
        updatedAt: account.updated_at,
      }),
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}