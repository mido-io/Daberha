import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

export const metadata = {
  title: "سياسة الخصوصية - دبرها",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface font-arabic">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-surface rounded-full transition-colors text-muted-foreground">
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="font-bold text-lg text-foreground flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            سياسة الخصوصية
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-border prose prose-slate rtl:prose-reverse max-w-none">
          <p className="text-sm text-muted-foreground mb-8">آخر تحديث: {new Date().toLocaleDateString('ar-EG')}</p>
          
          <h2>1. حماية بياناتك</h2>
          <p>
            في "دبرها"، نعتبر خصوصية بياناتك المالية أولوية قصوى. نحن لا نشارك أو نبيع بياناتك الشخصية أو المالية لأي أطراف ثالثة لأغراض تسويقية.
          </p>

          <h2>2. المعلومات التي نجمعها</h2>
          <ul>
            <li><strong>معلومات الحساب:</strong> الاسم، البريد الإلكتروني (مُدار بواسطة Clerk).</li>
            <li><strong>البيانات المالية:</strong> المعاملات، الميزانيات، والأهداف التي تقوم بإدخالها.</li>
            <li><strong>بيانات الاستخدام:</strong> معلومات حول كيفية تفاعلك مع التطبيق لتحسين تجربة المستخدم.</li>
          </ul>

          <h2>3. كيف نستخدم معلوماتك</h2>
          <p>
            نستخدم البيانات لتقديم الخدمة لك، مثل حساب مجاميع الميزانية، تتبع الأهداف، وعرض الإحصائيات. كما نستخدمها لإرسال إشعارات هامة (مثل تنبيهات الميزانية) إذا وافقت على ذلك.
          </p>

          <h2>4. أمان البيانات</h2>
          <p>
            تستخدم خوادمنا (Supabase) أحدث تقنيات التشفير لحماية بياناتك أثناء النقل والتخزين. نحن نتبع أفضل الممارسات الأمنية لمنع الوصول غير المصرح به.
          </p>

          <h2>5. حقوقك</h2>
          <p>
            يحق لك في أي وقت:
          </p>
          <ul>
            <li>الوصول إلى بياناتك وتصديرها.</li>
            <li>تعديل بياناتك الشخصية.</li>
            <li>حذف حسابك وجميع بياناتك المرتبطة به نهائياً من خوادمنا.</li>
          </ul>

          <h2>6. التواصل معنا</h2>
          <p>
            إذا كان لديك أي أسئلة حول سياسة الخصوصية، يرجى التواصل معنا عبر البريد الإلكتروني.
          </p>
        </div>
      </main>
    </div>
  );
}
