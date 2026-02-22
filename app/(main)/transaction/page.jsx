import { getUserTransactions } from "@/actions/transaction";
import { TransactionTable } from "../account/_components/transaction-table";
import { Suspense } from "react";
import { BarLoader } from "react-spinners";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function TransactionsPage() {
    const transactionsResponse = await getUserTransactions();
    const transactions = transactionsResponse.data || [];

    return (
        <div className="px-5 space-y-8" dir="rtl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight gradient-title font-arabic mb-2">
                        كل المصاريف والمعاملات
                    </h1>
                    <p className="text-muted-foreground font-arabic text-base md:text-lg">
                        تتبع جميع معاملاتك المالية وحركات حساباتك في مكان واحد.
                    </p>
                </div>
            </div>

            <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#4CAF50" />}>
                <TransactionTable transactions={transactions} />
            </Suspense>
        </div>
    );
}
