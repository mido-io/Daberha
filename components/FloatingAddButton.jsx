"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { usePathname } from "next/navigation";

export function FloatingAddButton() {
    const pathname = usePathname();

    // Don't show the button if the user is currently on the create transaction page
    if (pathname === "/transaction/create") {
        return null;
    }

    return (
        <Link href="/transaction/create" className="fixed bottom-6 right-6 z-50">
            <Button
                size="icon"
                className="w-14 h-14 rounded-full shadow-xl hover:scale-110 transition-transform bg-primary hover:bg-primary/90"
            >
                <Plus className="w-6 h-6" />
            </Button>
        </Link>
    );
}
