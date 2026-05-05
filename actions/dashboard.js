"use server";

import aj from "@/lib/arcjet";
import { supabase } from "@/lib/supabase";
import { request } from "@arcjet/next";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeTransaction = (obj) => {
  const serialized = { ...obj };
  if (obj.balance !== undefined) {
    serialized.balance = Number(obj.balance);
  }
  if (obj.amount !== undefined) {
    serialized.amount = Number(obj.amount);
  }
  
  // Map snake_case to camelCase
  if (obj.user_id !== undefined) serialized.userId = obj.user_id;
  if (obj.account_id !== undefined) serialized.accountId = obj.account_id;
  if (obj.is_default !== undefined) serialized.isDefault = obj.is_default;
  if (obj.created_at !== undefined) serialized.createdAt = obj.created_at;
  if (obj.updated_at !== undefined) serialized.updatedAt = obj.updated_at;
  if (obj.is_recurring !== undefined) serialized.isRecurring = obj.is_recurring;
  if (obj.recurring_interval !== undefined) serialized.recurringInterval = obj.recurring_interval;
  if (obj.next_recurring_date !== undefined) serialized.nextRecurringDate = obj.next_recurring_date;
  if (obj.last_processed !== undefined) serialized.lastProcessed = obj.last_processed;
  if (obj.receipt_url !== undefined) serialized.receiptUrl = obj.receipt_url;

  return serialized;
};

export async function getUserAccounts() {
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

  try {
    const { data: accounts, error: accountsError } = await supabase
      .from("accounts")
      .select("*, transactions(id)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (accountsError) throw new Error(accountsError.message);

    // Serialize accounts before sending to client
    const serializedAccounts = accounts.map(account => {
      const acc = {
        ...account,
        _count: {
          transactions: account.transactions ? account.transactions.length : 0,
        }
      };
      // remove transactions array to save space
      delete acc.transactions;
      return serializeTransaction(acc);
    });

    return serializedAccounts;
  } catch (error) {
    console.error(error.message);
  }
}

export async function createAccount(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Get request data for ArcJet
    const req = await request();

    // Check rate limit
    const decision = await aj.protect(req, {
      userId,
      requested: 1, // Specify how many tokens to consume
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaining, reset } = decision.reason;
        console.error({
          code: "RATE_LIMIT_EXCEEDED",
          details: {
            remaining,
            resetInSeconds: reset,
          },
        });

        throw new Error("Too many requests. Please try again later.");
      }

      throw new Error("Request blocked");
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_user_id", userId)
      .single();

    if (userError || !user) {
      throw new Error("User not found");
    }

    // Convert balance to float before saving
    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) {
      throw new Error("Invalid balance amount");
    }

    // Check if this is the user's first account
    const { count, error: countError } = await supabase
      .from("accounts")
      .select("*", { count: 'exact', head: true })
      .eq("user_id", user.id);

    if (countError) throw new Error(countError.message);

    // If it's the first account, make it default regardless of user input
    // If not, use the user's preference
    const shouldBeDefault = count === 0 ? true : data.isDefault;

    // If this account should be default, unset other default accounts
    if (shouldBeDefault) {
      await supabase
        .from("accounts")
        .update({ is_default: false })
        .eq("user_id", user.id)
        .eq("is_default", true);
    }

    // Create new account
    const { data: account, error: createError } = await supabase
      .from("accounts")
      .insert({
        name: data.name,
        type: data.type,
        balance: balanceFloat,
        user_id: user.id,
        is_default: shouldBeDefault, // Override the isDefault based on our logic
      })
      .select()
      .single();

    if (createError) throw new Error(createError.message);

    // Serialize the account before returning
    const serializedAccount = serializeTransaction(account);

    revalidatePath("/dashboard");
    return { success: true, data: serializedAccount };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getDashboardData() {
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

  // Get all user transactions
  const { data: transactions, error: transactionsError } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (transactionsError) throw new Error(transactionsError.message);

  return transactions.map(serializeTransaction);
}