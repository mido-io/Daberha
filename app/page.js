import { Button } from "@/components/ui/button";
import Link from "next/link";
import CountingMoneyAnimation from "@/components/CountingMoneyAnimation";
import { 
  LogIn, 
  ArrowLeft, 
  Play, 
  Wallet, 
  Brain, 
  CheckCircle2, 
  TrendingDown, 
  Users, 
  PenTool, 
  TrendingUp,
  Smartphone,
  ShieldCheck,
  Target,
  Sparkles
} from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-arabic">
      
      {/* 1. Hero Section (Emotional Hook First) */}
      <section className="relative pt-24 pb-32 overflow-hidden px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-accent/30">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 flex flex-col items-start text-start z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-6 text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>طريقتك الجديدة للتعامل مع الفلوس</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground tracking-tight leading-[1.1] text-right w-full">
              الفلوس بتخلص قبل آخر الشهر…<br/>
              <span className="text-primary">ومش عارف راحت فين؟</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg text-right w-full leading-relaxed">
              Dabbarha turns money management from a boring task into a simple daily habit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <SignedIn>
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-14 text-lg px-8 font-bold cursor-pointer transition-all hover:scale-105 shadow-lg shadow-primary/25">
                    لوحة التحكم
                  </Button>
                </Link>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button size="lg" className="w-full sm:w-auto h-14 text-lg px-8 font-bold cursor-pointer transition-all hover:scale-105 shadow-lg shadow-primary/25">
                    جرب النسخة الأولية <ArrowLeft className="mr-2 h-5 w-5 rtl:rotate-180" />
                  </Button>
                </SignInButton>
                <Link href="mailto:abdelhamidfarhat@icloud.com?subject=%D8%B7%D9%84%D8%A8%20%D8%A7%D9%84%D8%A7%D9%86%D8%B6%D9%85%D8%A7%D9%85%20%D9%84%D9%82%D8%A7%D8%A6%D9%85%D8%A9%20%D8%A7%D9%86%D8%AA%D8%B8%D8%A7%D8%B1%20%D8%AF%D8%A8%D8%B1%D9%91%D9%87%D8%A7">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 text-lg px-8 font-bold cursor-pointer transition-all hover:scale-105 border-2 bg-transparent hover:bg-accent/50">
                    انضم لقائمة الانتظار
                  </Button>
                </Link>
              </SignedOut>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 relative z-10 hidden md:block">
            {/* Animated Mockup */}
            <div className="relative w-full max-w-sm mx-auto animate-float">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 blur-3xl -z-10 rounded-full"></div>
              <div className="glass-card rounded-[2.5rem] p-2 border-4 border-white/40 shadow-2xl overflow-hidden relative">
                <div className="bg-[#222222] rounded-[2rem] overflow-hidden border border-border/50 h-[600px] flex flex-col relative text-white">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center px-6 py-4 text-sm font-sans opacity-90 z-30 relative">
                    <span className="font-semibold tracking-wider">9:41</span>
                    <div className="flex items-center gap-1.5">
                      <svg width="18" height="14" viewBox="0 0 16 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 3.5C16 3.5 13.5 0.5 8 0.5C2.5 0.5 0 3.5 0 3.5L8 11.5L16 3.5Z" />
                      </svg>
                      <svg width="20" height="12" viewBox="0 0 16 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 0H2C0.9 0 0 0.9 0 2V8C0 9.1 0.9 10 2 10H14C15.1 10 16 9.1 16 8V2C16 0.9 15.1 0 14 0Z" />
                        <path d="M14 2H2V8H14V2Z" fill="#222222" />
                        <path d="M3 3H13V7H3V3Z" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Dynamic Island Notch */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[110px] h-[30px] bg-[#0A0A0A] rounded-[20px] z-20"></div>
                  
                  {/* Content */}
                  <div className="flex-1 flex flex-col items-center justify-center pb-10">
                    <CountingMoneyAnimation />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Problem Section (Relatability) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-card border-y border-border/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
              هذا أنت؟
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              تتبع المصروفات بالطرق التقليدية ممل، متعب، ونهايته الاستسلام.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-accent/30 p-8 rounded-3xl border border-border/50 hover:bg-accent/50 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">بتنسى تسجل مصروفاتك</h3>
              <p className="text-muted-foreground leading-relaxed">
                تشتري حاجات طول اليوم وتيجي بليل مش فاكر صرفت فلوسك في إيه.
              </p>
            </div>
            <div className="bg-accent/30 p-8 rounded-3xl border border-border/50 hover:bg-accent/50 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-warning/10 text-warning flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingDown className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">مش عارف الفلوس بتروح فين</h3>
              <p className="text-muted-foreground leading-relaxed">
                الراتب بيخلص في أول 10 أيام وباقي الشهر بتسأل نفسك "أنا صرفت كل ده إمتى؟".
              </p>
            </div>
            <div className="bg-accent/30 p-8 rounded-3xl border border-border/50 hover:bg-accent/50 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">حاولت قبل كده وماكملتش</h3>
              <p className="text-muted-foreground leading-relaxed">
                نزلت تطبيقات كتير، سجلت يومين أو تلاتة وبعدين حسيت بملل ومسحتها.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Solution Section (Transformation) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-accent/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold mb-2 text-lg">سجل في ثواني</h4>
                  <p className="text-sm text-muted-foreground">بضغطة واحدة، بدون تعقيد أو شاشات زحمة.</p>
                </div>
                <div className="bg-card p-6 rounded-2xl shadow-sm border border-border sm:-translate-y-8">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold mb-2 text-lg">افهم صرفك فوراً</h4>
                  <p className="text-sm text-muted-foreground">تقارير بسيطة وواضحة بتقولك الحقيقة بدون مصطلحات مالية.</p>
                </div>
                <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold mb-2 text-lg">ابني عادة يومية</h4>
                  <p className="text-sm text-muted-foreground">بنساعدك تكمل من غير ما تحس إنك بتعمل مجهود كبير.</p>
                </div>
                <div className="bg-card p-6 rounded-2xl shadow-sm border border-border sm:-translate-y-8">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold mb-2 text-lg">تحكم كامل</h4>
                  <p className="text-sm text-muted-foreground">اعرف ميزانيتك قبل ما تخلص، وخطط لمصاريفك الجاية.</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 text-right">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground leading-[1.2]">
                الحل مش في إنك تحرم نفسك، الحل في إنك تفهم بتصرف في إيه.
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                صممنا دبرّها عشان يحول الإدارة المالية من مهمة تقيلة على القلب، لعادة يومية بسيطة وممتعة. 
                أنت مش محتاج تكون محاسب عشان تدير فلوسك.
              </p>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button size="lg" className="h-14 px-8 text-lg font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                    ابدأ التغيير دلوقتي
                  </Button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Demo Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-card text-center border-y border-border/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-foreground">
            شوف بنفسك، البساطة بتفرق إزاي
          </h2>
          <div className="relative rounded-3xl overflow-hidden bg-accent/50 border border-border shadow-xl flex items-center justify-center mb-8 h-[600px] w-full">
            <iframe 
              className="w-full h-full"
              style={{ border: "none" }} 
              src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FcLhKlhn6KKvwW2ZYQeEHj9%2F%25D8%25AF%25D8%25A8%25D9%2591%25D8%25B1%25D9%2587%25D8%25A7-prototype%3Fnode-id%3D1-638%26t%3DYHk4IUgpGYdcM6tk-1%26scaling%3Dmin-zoom%26content-scaling%3Dfixed%26page-id%3D0%253A1%26starting-point-node-id%3D1%253A638" 
              allowFullScreen 
            />
          </div>
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-2 hover:bg-accent">
                جربها بنفسك
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </section>

      {/* 5. Why It's Different (USP) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-foreground">
            ليه دبرّها مختلف؟
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 rounded-3xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
              <Brain className="w-10 h-10 text-primary mb-6 mx-auto" />
              <h3 className="font-bold text-xl mb-3">نظام مبني على العادات</h3>
              <p className="text-muted-foreground text-sm">
                مش مجرد تتبع، إحنا بنساعدك تبني العادة بفضل إشعارات ذكية في الوقت الصح.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
              <Smartphone className="w-10 h-10 text-secondary mb-6 mx-auto" />
              <h3 className="font-bold text-xl mb-3">مصمم للمستخدم العربي</h3>
              <p className="text-muted-foreground text-sm">
                واجهة عربية 100%، وتجربة مستخدم بتفهم ثقافتك وطريقة صرفك.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
              <Target className="w-10 h-10 text-chart-3 mb-6 mx-auto" />
              <h3 className="font-bold text-xl mb-3">تحديات وتحفيز</h3>
              <p className="text-muted-foreground text-sm">
                نظام نقاط وإنجازات بيحول توفير الفلوس للعبة ممتعة مش حرمان.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
              <CheckCircle2 className="w-10 h-10 text-chart-5 mb-6 mx-auto" />
              <h3 className="font-bold text-xl mb-3">بسيط ومش معقد</h3>
              <p className="text-muted-foreground text-sm">
                مفيش جداول ولا رسوم بيانية معقدة، بس اللي محتاج تعرفه بوضوح.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Social Proof */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            92%
          </h2>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto font-medium leading-relaxed">
            من الشباب العربي بيسألوا نفسهم آخر كل شهر:<br/>"فلوسي راحت فين؟"
          </p>
          <div className="mt-12 flex items-center justify-center gap-2 text-sm opacity-80 bg-primary-foreground/10 w-fit mx-auto px-4 py-2 rounded-full">
            <ShieldCheck className="w-5 h-5" />
            <span>بناءً على استطلاع آراء أكثر من 500 مستخدم</span>
          </div>
        </div>
      </section>

      {/* 7. Call for Contributors & 8. Transparency */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-card border-b border-border/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <div className="bg-background p-10 rounded-[2rem] border border-border shadow-sm">
            <h2 className="text-3xl font-bold mb-4">احنا بنبني دبرّها</h2>
            <p className="text-muted-foreground mb-8">
              إحنا لسه في البداية، وبندور على ناس مؤمنة بالرؤية تنضم لينا.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 font-medium">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <PenTool className="w-5 h-5" />
                </div>
                Digital Artists / UI/UX
              </li>
              <li className="flex items-center gap-3 font-medium">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <TrendingUp className="w-5 h-5" />
                </div>
                Growth Marketers
              </li>
              <li className="flex items-center gap-3 font-medium">
                <div className="w-10 h-10 rounded-full bg-chart-3/10 flex items-center justify-center text-chart-3">
                  <Wallet className="w-5 h-5" />
                </div>
                Early Investors
              </li>
              <li className="flex items-center gap-3 font-medium">
                <div className="w-10 h-10 rounded-full bg-chart-5/10 flex items-center justify-center text-chart-5">
                  <Users className="w-5 h-5" />
                </div>
                Financial Content Creators
              </li>
            </ul>
            <Link href="mailto:abdelhamidfarhat@icloud.com?subject=%D8%B7%D9%84%D8%A8%20%D8%A7%D9%84%D8%A7%D9%86%D8%B6%D9%85%D8%A7%D9%85%20%D9%84%D9%81%D8%B1%D9%8A%D9%82%20%D8%AF%D8%A8%D8%B1%D9%91%D9%87%D8%A7">
              <Button variant="outline" className="h-12 px-6 w-full sm:w-auto font-bold border-2 hover:bg-accent">
                انضم لفريقنا
              </Button>
            </Link>
          </div>

          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning/10 text-warning-foreground w-fit mb-6 text-sm font-bold border border-warning/20">
              <ShieldCheck className="w-4 h-4" />
              <span>الشفافية أولاً</span>
            </div>
            <h2 className="text-3xl font-bold mb-6">ده MVP مش بنك!</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              دبرّها في نسخته الحالية هو منتج تجريبي (MVP) يركز بالأساس على تتبع المصروفات وبناء العادات المالية الصحية.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              نحن لسنا تطبيقاً بنكياً، ولا نربط حساباتك البنكية، ولا نقدم خدمات مالية معقدة. نحن هنا لنساعدك على فهم سلوكك المالي بخطوات بسيطة وبدون تعقيد.
            </p>
            <p className="text-lg text-primary/80 leading-relaxed font-semibold">
              لكن رؤيتنا للمستقبل طموحة؛ من ضمن توجهاتنا أن يتطور "دبّرها" ليصبح محفظة بنكية متكاملة تلبي كافة احتياجاتك المالية.
            </p>
          </div>
          
        </div>
      </section>

      {/* 9. Final CTA */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-primary/5 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-foreground tracking-tight leading-tight">
            جاهز تتحكم في فلوسك؟
          </h2>
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            انضم للنسخة الأولية وشاركنا في بناء مستقبل الإدارة المالية في الوطن العربي.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button size="lg" className="w-full sm:w-auto h-14 text-lg px-10 font-bold shadow-lg shadow-primary/25 hover:scale-105 transition-transform">
                  جرب النسخة الأولية
                </Button>
              </SignInButton>
              <Link href="mailto:abdelhamidfarhat@icloud.com?subject=%D8%B7%D9%84%D8%A8%20%D8%A7%D9%84%D8%A7%D9%86%D8%B6%D9%85%D8%A7%D9%85%20%D9%84%D9%82%D8%A7%D8%A6%D9%85%D8%A9%20%D8%A7%D9%86%D8%AA%D8%B8%D8%A7%D8%B1%20%D8%AF%D8%A8%D8%B1%D9%91%D9%87%D8%A7">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 text-lg px-10 font-bold bg-card hover:bg-accent transition-colors border-2">
                  انضم لقائمة الانتظار
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-14 text-lg px-10 font-bold shadow-lg shadow-primary/25 hover:scale-105 transition-transform">
                  الذهاب للوحة التحكم
                </Button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </section>
      
    </div>
  );
}