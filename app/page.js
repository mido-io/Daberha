import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 font-arabic">
      <h1 className="text-6xl md:text-8xl font-bold mb-6 text-primary tracking-tight">
        دبّرها
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-lg mx-auto">
        إدارة أموالك بذكاء ووضوح. تتبع مصروفاتك بكل بساطة، واتخذ قرارات مالية أفضل.
      </p>
      <div className="flex gap-4">
        <SignedIn>
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-8 font-bold cursor-pointer transition-all hover:scale-105">
              لوحة التحكم
            </Button>
          </Link>
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button size="lg" className="text-lg px-8 font-bold border-2 cursor-pointer transition-all hover:scale-105" variant="outline">
              <LogIn className="ml-2 h-5 w-5 rtl:scale-x-[-1]" /> تسجيل الدخول
            </Button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  );
}
