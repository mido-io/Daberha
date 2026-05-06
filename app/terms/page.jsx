import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "شروط الاستخدام - دبرها",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface font-arabic">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-surface rounded-full transition-colors text-muted-foreground">
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="font-bold text-lg text-foreground flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            شروط الاستخدام
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-border prose prose-slate rtl:prose-reverse max-w-none">
          <p className="text-sm text-muted-foreground mb-8">آخر تحديث: {new Date().toLocaleDateString('ar-EG')}</p>
          
          <h2>1. قبول الشروط</h2>
          <p>
            باستخدامك لتطبيق "دبرها"، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام التطبيق.
          </p>

          <h2>2. وصف الخدمة</h2>
          <p>
            يقدم "دبرها" أدوات لتتبع المصروفات، إدارة الميزانية، وتحديد الأهداف المالية الشخصية والمشتركة. التطبيق لا يقدم نصائح مالية أو استثمارية متخصصة.
          </p>

          <h2>3. حساب المستخدم</h2>
          <ul>
            <li>أنت مسؤول عن الحفاظ على سرية معلومات حسابك.</li>
            <li>يجب تقديم معلومات دقيقة وحديثة عند التسجيل.</li>
            <li>نحن نحتفظ بالحق في تعليق أو إنهاء الحسابات التي تنتهك شروطنا.</li>
          </ul>

          <h2>4. الخصوصية والبيانات</h2>
          <p>
            نحن نحترم خصوصيتك. يتم تشفير بياناتك المالية وحمايتها. يرجى مراجعة <Link href="/privacy" className="text-primary hover:underline">سياسة الخصوصية</Link> لمعرفة المزيد حول كيفية تعاملنا مع بياناتك.
          </p>

          <h2>5. التعديلات</h2>
          <p>
            نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إشعارك بالتغييرات الجوهرية من خلال التطبيق. استمرارك في استخدام التطبيق يعني قبولك للشروط المعدلة.
          </p>
        </div>
      </main>
    </div>
  );
}
