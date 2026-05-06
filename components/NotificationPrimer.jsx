"use client";

import { useState, useEffect } from "react";
import { Bell, X, Check } from "lucide-react";

export function NotificationPrimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  useEffect(() => {
    // Check if we should show the primer
    const hasPrompted = localStorage.getItem("daberha_notification_prompted");
    
    // Check if Notification API is available and not already granted/denied
    if (
      !hasPrompted && 
      "Notification" in window && 
      Notification.permission === "default"
    ) {
      // Small delay to not overwhelm the user immediately on load
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleRequestPermission = async () => {
    setStatus("loading");
    
    try {
      const permission = await Notification.requestPermission();
      
      localStorage.setItem("daberha_notification_prompted", "true");
      
      if (permission === "granted") {
        setStatus("success");
        setTimeout(() => setIsOpen(false), 2000);
      } else {
        setStatus("error");
        setTimeout(() => setIsOpen(false), 2000);
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      setStatus("error");
      setTimeout(() => setIsOpen(false), 2000);
    }
  };

  const handleClose = () => {
    localStorage.setItem("daberha_notification_prompted", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/50 backdrop-blur-sm p-4 font-arabic transition-opacity">
      <div className="bg-white w-full max-w-md rounded-[24px] rounded-b-none sm:rounded-[24px] overflow-hidden shadow-xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
        
        {/* Handle for mobile */}
        <div className="w-12 h-1.5 bg-border rounded-full mx-auto mt-3 mb-2 sm:hidden" />

        <div className="p-6">
          <div className="flex justify-end sm:hidden">
            <button onClick={handleClose} className="p-2 text-muted-foreground hover:bg-surface rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center mb-6">
            {status === "success" ? (
              <div className="w-16 h-16 bg-success/10 rounded-2xl mx-auto flex items-center justify-center text-success mb-4 animate-in zoom-in">
                <Check className="w-8 h-8" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center text-primary mb-4 relative">
                <Bell className="w-8 h-8" />
                <div className="absolute top-3 right-3 w-3 h-3 bg-error rounded-full border-2 border-white animate-pulse" />
              </div>
            )}
            
            <h2 className="text-xl font-bold text-foreground mb-2">
              {status === "success" ? "تم التفعيل بنجاح!" : "خليك متابع أول بأول"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {status === "success" 
                ? "هيوصلك إشعارات وتنبيهات مهمة." 
                : "فعّل الإشعارات عشان نفكرك تسجل مصاريفك، وتتابع أهدافك المشتركة، وتحافظ على سلسلتك (Streak) 🔥"}
            </p>
          </div>

          {status !== "success" && (
            <div className="space-y-3">
              <button 
                onClick={handleRequestPermission}
                disabled={status === "loading"}
                className="w-full py-3.5 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-md disabled:opacity-70 flex items-center justify-center"
              >
                {status === "loading" ? "جاري التفعيل..." : "تفعيل الإشعارات"}
              </button>
              <button 
                onClick={handleClose}
                className="w-full py-3.5 rounded-xl bg-surface text-foreground font-bold hover:bg-border transition-colors"
              >
                ليس الآن
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
