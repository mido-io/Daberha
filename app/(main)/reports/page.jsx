import { getUserTransactions } from "@/actions/transaction";
import { getUserAccounts } from "@/actions/dashboard";
import { AccountChart } from "../account/_components/account-chart";
import { AccountFilter } from "./_components/account-filter";
import { Suspense } from "react";
import { BarLoader } from "react-spinners";

export default async function ReportsPage({ searchParams }) {
    const params = await searchParams;
    const accountId = params?.accountId;

    // Filter out "all" or undefined
    const query = (accountId && accountId !== "all") ? { accountId } : {};

    const [transactionsResponse, accounts] = await Promise.all([
        getUserTransactions(query),
        getUserAccounts()
    ]);
    const transactions = transactionsResponse.data || [];

    return (
        <div className="px-5 space-y-8" dir="rtl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight gradient-title font-arabic mb-2">
                        التقارير المالية
                    </h1>
                    <p className="text-muted-foreground font-arabic text-base md:text-lg">
                        تصوير بياني شامل لدخلك ومصروفاتك. حدد حساباً لرؤية تقاريره.
                    </p>
                </div>

                {/* Account Switcher */}
                <div className="flex-shrink-0 font-arabic">
                    <AccountFilter accounts={accounts || []} />
                </div>
            </div>

            <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#4CAF50" />}>
                <div className="pt-4">
                    <AccountChart transactions={transactions} />
                </div>
            </Suspense>
        </div>
    );
}
