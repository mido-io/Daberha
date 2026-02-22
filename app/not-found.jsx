import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Wallet, Receipt, LineChart, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center font-arabic" dir="rtl">
      <h1 className="text-8xl md:text-9xl font-bold text-primary mb-4 opacity-20">404</h1>
      <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-title">عذراً، هذه الصفحة غير موجودة</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-10 text-lg">
        لا يمكننا العثور على الصفحة التي تبحث عنها. يمكنك العودة إلى الصفحة الرئيسية أو متابعة إدارة أموالك من خلال الروابط أدناه.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg mx-auto">
        {/* Dashboard */}
        <Link href="/dashboard" className="w-full">
          <Button variant="default" className="w-full h-14 text-lg justify-start gap-4 px-6 hover:scale-105 transition-transform" size="lg">
            <LayoutDashboard className="w-6 h-6" />
            <span className="font-arabic font-bold">الرئيسية</span>
          </Button>
        </Link>

        {/* Budget */}
        <Link href="/budget" className="w-full">
          <Button variant="outline" className="w-full h-14 text-lg justify-start gap-4 px-6 hover:border-primary/50 transition-colors" size="lg">
            <Wallet className="w-6 h-6 text-primary" />
            <span className="font-arabic font-bold">الميزانية</span>
          </Button>
        </Link>

        {/* Transactions / Expenses */}
        <Link href="/transaction" className="w-full">
          <Button variant="outline" className="w-full h-14 text-lg justify-start gap-4 px-6 hover:border-primary/50 transition-colors" size="lg">
            <Receipt className="w-6 h-6 text-primary" />
            <span className="font-arabic font-bold">المصاريف</span>
          </Button>
        </Link>

        {/* Reports */}
        <Link href="/reports" className="w-full">
          <Button variant="outline" className="w-full h-14 text-lg justify-start gap-4 px-6 hover:border-primary/50 transition-colors" size="lg">
            <LineChart className="w-6 h-6 text-primary" />
            <span className="font-arabic font-bold">التقارير</span>
          </Button>
        </Link>
      </div>

      <div className="mt-12">
        <Link href="/">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground gap-2">
            <Home className="w-4 h-4" />
            العودة إلى الصفحة الترحيبية
          </Button>
        </Link>
      </div>
    </div>
  );
}