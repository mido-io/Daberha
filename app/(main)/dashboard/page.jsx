import { Suspense } from "react";
import { getUserAccounts } from "@/actions/dashboard";
import { getDashboardData } from "@/actions/dashboard";
import { getCurrentBudget } from "@/actions/budget";
import { AccountCard } from "./_components/account-card";
import CreateAccountDrawer from "@/components/CreateAccountDrawer";
import { BudgetProgress } from "./_components/budget-progress";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Flame, ChevronLeft } from "lucide-react";
import { DashboardOverview } from "./_components/transaction-overview";
import { trackDailyActivity } from "@/actions/gamification";
import Link from "next/link";

export default async function DashboardPage() {
  const [accounts, transactions, trackResult] = await Promise.all([
    getUserAccounts(),
    getDashboardData(),
    trackDailyActivity(),
  ]);

  const streakDays = trackResult?.streakDays || 0;

  const defaultAccount = accounts?.find((account) => account.isDefault);

  // Get budget for default account
  let budgetData = null;
  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }

  return (
    <div className="space-y-8">
      {/* Budget Progress */}
      <BudgetProgress
        initialBudget={budgetData?.budget}
        currentExpenses={budgetData?.currentExpenses || 0}
      />

      {/* Streak Card Wide */}
      <Link href="/leaderboard" className="block">
        <div className="bg-white border border-border rounded-2xl p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
          <div className="w-12 h-12 bg-[#FFF0EA] rounded-xl flex items-center justify-center text-[#FF6B35] shrink-0">
            <Flame className="w-7 h-7 fill-current" />
          </div>
          <div className="flex-1 font-arabic">
            <div className="text-sm font-bold text-foreground">
              سلسلة {streakDays} يوم 🔥
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              استمر في تسجيل نشاطك لزيادة نقاطك
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </div>
      </Link>

      {/* Dashboard Overview */}
      <DashboardOverview
        accounts={accounts}
        transactions={transactions || []}
      />

      {/* Accounts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CreateAccountDrawer>
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
              <p className="text-sm font-medium font-arabic">إضافة حساب جديد</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>
        {accounts.length > 0 &&
          accounts?.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
      </div>
    </div>
  );
}