"use client";

import Link from "next/link";
import { SearchX, Home, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 font-arabic text-center">
      <div className="w-24 h-24 bg-white rounded-3xl shadow-sm border border-border flex items-center justify-center mb-6 text-primary relative">
        <SearchX className="w-12 h-12" />
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-error text-white rounded-full flex items-center justify-center font-en font-bold text-sm shadow-md">
          404
        </div>
      </div>
      
      <h1 className="text-3xl font-bold text-foreground mb-3">
        الصفحة غير موجودة
      </h1>
      <p className="text-muted-foreground max-w-xs mb-8 leading-relaxed">
        يبدو أنك ضللت الطريق. الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
      </p>

      <div className="flex flex-col w-full max-w-xs gap-3">
        <Link 
          href="/dashboard"
          className="w-full py-3.5 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          العودة للرئيسية
        </Link>
        <button 
          onClick={() => window.history.back()}
          className="w-full py-3.5 rounded-xl bg-white border border-border text-foreground font-bold hover:bg-surface transition-colors flex items-center justify-center gap-2"
        >
          الرجوع للخلف
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}