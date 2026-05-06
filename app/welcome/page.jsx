"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Wallet, Target, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function WelcomePage() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      router.push("/sign-up");
    }
  };

  const skip = () => {
    router.push("/sign-up");
  };

  if (step === 0) {
    // Splash Screen
    return (
      <div className="min-h-screen bg-[#1F1F1F] bg-gradient-to-b from-[#1F1F1F] to-[#333333] flex flex-col items-center justify-between p-6 font-arabic relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#4CAF50] opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -right-32 w-80 h-80 bg-[#FF6B35] opacity-10 rounded-full blur-3xl"></div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center w-full z-10 text-center">
          <h1 className="text-7xl font-bold text-[#4CAF50] mb-6 tracking-tight">دبّرها</h1>
          <p className="text-white/70 text-lg max-w-[260px] leading-relaxed">
            اللي بينفعك دلوقتي هو اللي بتعمله اليوم
          </p>
        </div>

        <div className="w-full z-10 space-y-4 pb-6">
          <button 
            onClick={handleNext}
            className="w-full py-4 rounded-xl bg-[#4CAF50] text-white font-bold text-lg hover:bg-[#43A047] transition-colors shadow-lg shadow-[#4CAF50]/20"
          >
            ابدأ الآن
          </button>
          <div className="text-center text-sm text-white/60">
            عندك حساب؟ <Link href="/sign-in" className="text-[#4CAF50] font-bold hover:underline">تسجيل الدخول</Link>
          </div>
        </div>
      </div>
    );
  }

  // Walkthrough slides
  const slides = [
    {
      icon: <Wallet className="w-16 h-16 text-primary" />,
      title: "نظم فلوسك بذكاء",
      desc: "تابع مصاريفك ودخلك لحظة بلحظة، واعرف فلوسك بتروح فين عشان تقدر تتحكم فيها."
    },
    {
      icon: <Target className="w-16 h-16 text-[#FFC107]" />,
      title: "حقق أهدافك أسرع",
      desc: "حط هدف للسفر، عربية جديدة، أو حتى ادخار للطوارئ، وإحنا هنساعدك توصله."
    },
    {
      icon: <TrendingUp className="w-16 h-16 text-success" />,
      title: "حافظ على حماسك",
      desc: "كل يوم بتسجل فيه نشاطك بتبني سلسلة (Streak) تكسب بيها نقط وألقاب."
    }
  ];

  const currentSlide = slides[step - 1];

  return (
    <div className="min-h-screen bg-white flex flex-col font-arabic relative overflow-hidden">
      {/* Top Navigation */}
      <div className="flex justify-between items-center p-6 z-10">
        <div className="text-sm font-bold text-muted-foreground font-en">
          {step} / 3
        </div>
        <button onClick={skip} className="text-sm font-bold text-primary">
          تخطي
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center z-10">
        <div className="w-32 h-32 bg-surface rounded-full flex items-center justify-center mb-8 shadow-inner relative">
          <div className="absolute inset-0 bg-primary/5 rounded-full animate-pulse"></div>
          {currentSlide.icon}
        </div>
        
        <h2 className="text-2xl font-bold text-foreground mb-4">
          {currentSlide.title}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {currentSlide.desc}
        </p>
      </div>

      {/* Bottom Controls */}
      <div className="p-6 z-10">
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((idx) => (
            <div 
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === step ? "w-8 bg-primary" : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>

        <button 
          onClick={handleNext}
          className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
        >
          {step === 3 ? "ابدأ رحلتك" : "التالي"}
          {step !== 3 && <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
