import { z } from "zod";

export const accountSchema = z.object({
  name: z.string({ required_error: "اسم الحساب مطلوب", invalid_type_error: "الرجاء إدخال اسم صحيح" }).min(1, "اسم الحساب مطلوب"),
  type: z.enum(["CURRENT", "SAVINGS"], { required_error: "الرجاء اختيار نوع الحساب" }),
  balance: z.string({ required_error: "الرصيد الافتتاحي مطلوب", invalid_type_error: "الرصيد غير صالح" }).min(1, "الرصيد الافتتاحي مطلوب"),
  isDefault: z.boolean().default(false),
});

export const transactionSchema = z
  .object({
    type: z.enum(["INCOME", "EXPENSE"], { required_error: "الرجاء تحديد نوع المعاملة" }),
    amount: z.string({ required_error: "المبلغ مطلوب", invalid_type_error: "المبلغ غير صالح" }).min(1, "المبلغ مطلوب"),
    description: z.string().optional(),
    date: z.date({ required_error: "التاريخ مطلوب", invalid_type_error: "تاريخ غير صالح" }),
    accountId: z.string({ required_error: "الرجاء اختيار الحساب", invalid_type_error: "حساب غير صالح" }).min(1, "الحساب مطلوب"),
    category: z.string({ required_error: "الرجاء اختيار تصنيف", invalid_type_error: "تصنيف غير صالح" }).min(1, "التصنيف مطلوب"),
    isRecurring: z.boolean().default(false),
    recurringInterval: z
      .enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"])
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isRecurring && !data.recurringInterval) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "فترة التكرار مطلوبة للمعاملات المتكررة",
        path: ["recurringInterval"],
      });
    }
  });