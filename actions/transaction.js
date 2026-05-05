"use server";

import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";
import aj from "@/lib/arcjet";
import { request } from "@arcjet/next";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const serializeAmount = (obj) => {
  const serialized = { ...obj };
  if (obj.amount !== undefined) {
    serialized.amount = Number(obj.amount);
  }
  if (obj.balance !== undefined) {
    serialized.balance = Number(obj.balance);
  }
  if (obj.account) {
    serialized.account = {
      ...obj.account,
      balance: obj.account.balance !== undefined ? Number(obj.account.balance) : obj.account.balance,
      userId: obj.account.user_id,
      isDefault: obj.account.is_default,
      createdAt: obj.account.created_at,
      updatedAt: obj.account.updated_at,
    };
  }

  // Map snake_case to camelCase
  if (obj.user_id !== undefined) serialized.userId = obj.user_id;
  if (obj.account_id !== undefined) serialized.accountId = obj.account_id;
  if (obj.is_recurring !== undefined) serialized.isRecurring = obj.is_recurring;
  if (obj.recurring_interval !== undefined) serialized.recurringInterval = obj.recurring_interval;
  if (obj.next_recurring_date !== undefined) serialized.nextRecurringDate = obj.next_recurring_date;
  if (obj.last_processed !== undefined) serialized.lastProcessed = obj.last_processed;
  if (obj.receipt_url !== undefined) serialized.receiptUrl = obj.receipt_url;
  if (obj.created_at !== undefined) serialized.createdAt = obj.created_at;
  if (obj.updated_at !== undefined) serialized.updatedAt = obj.updated_at;

  return serialized;
};

// Create Transaction
export async function createTransaction(data) {
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

    const { data: account, error: accountError } = await supabase
      .from("accounts")
      .select("id, balance")
      .eq("id", data.accountId)
      .eq("user_id", user.id)
      .single();

    if (accountError || !account) {
      throw new Error("Account not found");
    }

    const nextRecurringDate = data.isRecurring && data.recurringInterval
      ? calculateNextRecurringDate(data.date, data.recurringInterval)
      : null;

    // Use RPC to create transaction and update account balance atomically
    const { data: transaction, error: rpcError } = await supabase.rpc(
      "create_transaction_rpc",
      {
        p_user_id: user.id,
        p_account_id: data.accountId,
        p_type: data.type,
        p_amount: data.amount,
        p_description: data.description || null,
        p_category: data.category,
        p_receipt_url: data.receiptUrl || null,
        p_status: data.status || "COMPLETED",
        p_is_recurring: data.isRecurring || false,
        p_recurring_interval: data.recurringInterval || null,
        p_next_recurring_date: nextRecurringDate,
        p_date: data.date,
      }
    );

    if (rpcError) {
      throw new Error(rpcError.message);
    }

    revalidatePath("/dashboard");
    revalidatePath(`/account/${transaction.account_id}`);

    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getTransaction(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (userError || !user) throw new Error("User not found");

  const { data: transaction, error: transactionError } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (transactionError || !transaction) throw new Error("Transaction not found");

  return serializeAmount(transaction);
}

export async function updateTransaction(id, data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_user_id", userId)
      .single();

    if (userError || !user) throw new Error("User not found");

    const nextRecurringDate = data.isRecurring && data.recurringInterval
      ? calculateNextRecurringDate(data.date, data.recurringInterval)
      : null;

    // Use RPC to update transaction and account balance atomically
    const { data: transaction, error: rpcError } = await supabase.rpc(
      "update_transaction_rpc",
      {
        p_transaction_id: id,
        p_user_id: user.id,
        p_account_id: data.accountId,
        p_type: data.type,
        p_amount: data.amount,
        p_description: data.description || null,
        p_category: data.category,
        p_receipt_url: data.receiptUrl || null,
        p_status: data.status || "COMPLETED",
        p_is_recurring: data.isRecurring || false,
        p_recurring_interval: data.recurringInterval || null,
        p_next_recurring_date: nextRecurringDate,
        p_date: data.date,
      }
    );

    if (rpcError) {
      throw new Error(rpcError.message);
    }

    revalidatePath("/dashboard");
    revalidatePath(`/account/${data.accountId}`);

    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    throw new Error(error.message);
  }
}

// Get User Transactions
export async function getUserTransactions(query = {}) {
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

    let queryBuilder = supabase
      .from("transactions")
      .select("*, account:accounts(*)")
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    if (query.accountId) {
      queryBuilder = queryBuilder.eq("account_id", query.accountId);
    }
    if (query.limit) {
      queryBuilder = queryBuilder.limit(query.limit);
    }
    // Handle other query params as needed, but standard query object doesn't have an exact mapping without iterating

    const { data: transactions, error: transactionsError } = await queryBuilder;

    if (transactionsError) {
      throw new Error(transactionsError.message);
    }

    return { success: true, data: transactions.map(serializeAmount) };
  } catch (error) {
    throw new Error(error.message);
  }
}

// Scan Receipt
export async function scanReceipt(formData) {
  try {
    const file = formData.get("file");
    if (!file) {
      throw new Error("لم يتم العثور على أي ملف");
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
    });

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    // Convert ArrayBuffer to Base64
    const base64String = Buffer.from(arrayBuffer).toString("base64");

    const prompt = `
      Analyze this receipt image and extract the following information in JSON format:
      - Total amount (just the number. IMPORTANT: remove any commas or currency symbols. For example, if it says 900,000 return 900000)
      - Date (in ISO format)
      - Description or items purchased (brief summary, use Arabic if the receipt is in Arabic)
      - Merchant/store name (use Arabic if the receipt is in Arabic)
      - Suggested category (MUST be exactly one of these English words: housing, transportation, groceries, utilities, entertainment, food, shopping, healthcare, education, personal, travel, insurance, gifts, bills, other-expense)
      
      Only respond with a raw, valid JSON object in this exact format. Do not use Markdown blocks (like \`\`\`json):
      {
        "amount": number,
        "date": "ISO date string",
        "description": "string",
        "merchantName": "string",
        "category": "string"
      }
    `;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64String,
          mimeType: file.type || "image/jpeg",
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").replace(/```/g, "").trim();

    try {
      const data = JSON.parse(cleanedText);
      const parsedAmount = typeof data.amount === "string"
        ? parseFloat(data.amount.replace(/,/g, ""))
        : parseFloat(data.amount);

      return {
        amount: parsedAmount,
        date: new Date(data.date),
        description: data.description,
        category: data.category,
        merchantName: data.merchantName,
      };
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      throw new Error("Invalid response format from Gemini");
    }
  } catch (error) {
    console.error("Error scanning receipt:", error);
    if (error.message.includes("429") || error.message.includes("quota")) {
      throw new Error("عفواً، لقد تجاوزنا الحد المسموح به مجاناً في الذكاء الاصطناعي حالياً. يرجى المحاولة بعد قليل.");
    }
    throw new Error("فشل في مسح وقراءة الإيصال");
  }
}

// Helper function to calculate next recurring date
function calculateNextRecurringDate(startDate, interval) {
  const date = new Date(startDate);

  switch (interval) {
    case "DAILY":
      date.setDate(date.getDate() + 1);
      break;
    case "WEEKLY":
      date.setDate(date.getDate() + 7);
      break;
    case "MONTHLY":
      date.setMonth(date.getMonth() + 1);
      break;
    case "YEARLY":
      date.setFullYear(date.getFullYear() + 1);
      break;
  }

  return date;
}