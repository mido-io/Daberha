"use client";

import Lottie from "lottie-react";
import { useEffect, useState } from "react";

export default function CountingMoneyAnimation() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch("/counting-money.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch animation: " + res.status);
        return res.json();
      })
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Error loading animation:", err));
  }, []);

  if (!animationData) {
    return <div className="h-48 w-48 animate-pulse bg-white/5 rounded-full mb-4" />;
  }

  return (
    <>
      <div className="w-56 h-56 -mt-8 mb-2 z-10 drop-shadow-2xl">
        <Lottie 
          animationData={animationData} 
          loop={true} 
          className="w-full h-full"
        />
      </div>
      <h2 className="text-[4rem] font-bold text-primary mb-2 leading-none tracking-tight z-20" style={{ textShadow: "0 4px 30px rgba(76, 175, 80, 0.3)" }}>
        دبّرها
      </h2>
      <p className="text-white/80 text-xl font-medium mt-1 z-20 text-center px-4">
        دبّرها.. وأعرف فلوسك بتروح فين
      </p>
    </>
  );
}
