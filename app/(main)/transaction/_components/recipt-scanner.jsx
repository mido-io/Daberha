"use client";

import { useRef, useEffect } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { scanReceipt } from "@/actions/transaction";

export function ReceiptScanner({ onScanComplete }) {
  const fileInputRef = useRef(null);

  const {
    loading: scanReceiptLoading,
    fn: scanReceiptFn,
    data: scannedData,
    error: scanError,
  } = useFetch(scanReceipt);

  const handleReceiptScan = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("يجب أن يكون حجم الملف أقل من 5 ميجابايت");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    await scanReceiptFn(formData);
  };

  useEffect(() => {
    if (scannedData && !scanReceiptLoading) {
      onScanComplete(scannedData);
      toast.success("تم مسح الإيصال بنجاح");
    }
  }, [scanReceiptLoading, scannedData, onScanComplete]);

  useEffect(() => {
    if (scanError) {
      toast.error(scanError.message || "حدث خطأ أثناء مسح الإيصال");
    }
  }, [scanError]);

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleReceiptScan(file);
        }}
      />
      <Button
        type="button"
        variant="outline"
        className="w-full h-10 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 animate-gradient hover:opacity-90 transition-opacity text-white hover:text-white"
        onClick={() => fileInputRef.current?.click()}
        disabled={scanReceiptLoading}
      >
        {scanReceiptLoading ? (
          <>
            <Loader2 className="mr-2 animate-spin" />
            <span>جاري مسح الإيصال...</span>
          </>
        ) : (
          <>
            <Camera className="mr-2" />
            <span>مسح الإيصال بالذكاء الاصطناعي</span>
          </>
        )}
      </Button>
    </div>
  );
}