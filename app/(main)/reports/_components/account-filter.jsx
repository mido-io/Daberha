"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Suspense, useEffect, useState } from "react";

function AccountFilterComponent({ accounts }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentAccountId = searchParams.get("accountId") || "all";

    const handleAccountChange = (value) => {
        const params = new URLSearchParams(searchParams);
        if (value && value !== "all") {
            params.set("accountId", value);
        } else {
            params.delete("accountId");
        }
        router.push(`/reports?${params.toString()}`);
    };

    return (
        <Select
            value={currentAccountId}
            onValueChange={handleAccountChange}
        >
            <SelectTrigger className="w-full md:w-[250px] bg-background border-border shadow-sm">
                <SelectValue placeholder="اختر الحساب لعرض التقارير" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">كافة الحسابات</SelectItem>
                {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                        {account.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

export function AccountFilter({ accounts }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return <div className="h-10 w-full md:w-[250px] bg-muted animate-pulse rounded-md" />;

    return (
        <Suspense fallback={<div className="h-10 w-full md:w-[250px] bg-muted animate-pulse rounded-md" />}>
            <AccountFilterComponent accounts={accounts} />
        </Suspense>
    );
}
