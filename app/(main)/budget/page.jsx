import { getCurrentBudget } from "@/actions/budget";
import { getUserAccounts } from "@/actions/dashboard";
import { BudgetProgress } from "../dashboard/_components/budget-progress";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
import { BarLoader } from "react-spinners";
import { Card, CardContent } from "@/components/ui/card";
import { Target, TrendingDown } from "lucide-react";

export default async function BudgetPage() {
    const budgetData = await getCurrentBudget();
    const accounts = await getUserAccounts();

    // Getting the specific Current/Checking (الجاري) account
    const currentAccount = accounts?.find((a) => a.type === "CURRENT" || a.isDefault);
    let currentAccountBudget = null;

    if (currentAccount) {
        currentAccountBudget = await getCurrentBudget(currentAccount.id);
    }

    // Pacing calculations
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const elapsedDays = now.getDate();
    const remainingDays = Math.max(1, daysInMonth - elapsedDays + 1);

    const budgetAmount = currentAccountBudget?.budget?.amount || 0;
    const currentExpenses = currentAccountBudget?.currentExpenses || 0;

    const actualDailyAvg = elapsedDays > 0 ? (currentExpenses / elapsedDays) : 0;
    const targetDailyAvg = remainingDays > 0 ? (Math.max(0, budgetAmount - currentExpenses) / remainingDays) : 0;

    return (
        <div className="px-5 space-y-8" dir="rtl">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight gradient-title font-arabic">
                    الميزانية الشهرية
                </h1>
            </div>

            <p className="text-muted-foreground font-arabic text-lg">
                راقب ميزانيتك الشهرية وتتبع مدى التزامك بها عبر الحساب الجاري.
            </p>

            <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#4CAF50" />}>

                <div className="pt-4 w-full space-y-6">
                    <BudgetProgress
                        initialBudget={budgetData?.budget}
                        currentExpenses={budgetData?.currentExpenses || 0}
                    />

                    {currentAccountBudget?.budget && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            {/* Target Card */}
                            <Card className="border border-border shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-2 h-full bg-primary/20 rounded-r-xl" />
                                <CardContent className="p-6 flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-muted-foreground font-arabic flex items-center gap-2">
                                            <Target className="h-5 w-5 text-primary" />
                                            الهدف اليومي المسموح
                                        </p>
                                    </div>
                                    <p className="text-3xl font-bold font-sans" dir="ltr">{targetDailyAvg.toFixed(2)}$</p>
                                    <p className="text-xs text-muted-foreground font-arabic">أقصى حد يومي للإلتزام بالميزانية</p>
                                </CardContent>
                            </Card>

                            {/* Actual Card */}
                            <Card className={`border shadow-sm transition-colors relative overflow-hidden ${actualDailyAvg > targetDailyAvg ? "border-red-200 dark:border-red-900 bg-red-50/20 dark:bg-red-950/10" : "border-border"}`}>
                                <div className={`absolute top-0 right-0 w-2 h-full rounded-r-xl ${actualDailyAvg > targetDailyAvg ? "bg-red-500/50" : "bg-green-500/50"}`} />
                                <CardContent className="p-6 flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-muted-foreground font-arabic flex items-center gap-2">
                                            <TrendingDown className={`h-5 w-5 ${actualDailyAvg > targetDailyAvg ? "text-red-500" : "text-green-500"}`} />
                                            متوسط الصرف الفعلي
                                        </p>
                                    </div>
                                    <p className={`text-3xl font-bold font-sans ${actualDailyAvg > targetDailyAvg ? "text-red-600 dark:text-red-400" : ""}`} dir="ltr">{actualDailyAvg.toFixed(2)}$</p>
                                    <p className="text-xs text-muted-foreground font-arabic">
                                        {actualDailyAvg > targetDailyAvg ? "تحذير: أنت تتجاوز الهدف اليومي!" : "ممتاز: أنت ضمن المعدل السليم"}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>

            </Suspense>
        </div>
    );
}
