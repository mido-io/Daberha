"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 font-arabic text-center">
      <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mb-6 text-error animate-pulse">
        <AlertCircle className="w-12 h-12" />
      </div>
      
      <h1 className="text-2xl font-bold text-foreground mb-3">
        عذراً، حدث خطأ غير متوقع
      </h1>
      <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
        واجهنا مشكلة أثناء معالجة طلبك. يرجى المحاولة مرة أخرى أو العودة للصفحة الرئيسية.
      </p>

      <div className="flex flex-col w-full max-w-xs gap-3">
        <button 
          onClick={() => reset()}
          className="w-full py-3.5 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <RefreshCcw className="w-5 h-5" />
          حاول مرة أخرى
        </button>
        <Link 
          href="/dashboard"
          className="w-full py-3.5 rounded-xl bg-white border border-border text-foreground font-bold hover:bg-surface transition-colors flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
