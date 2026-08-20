import { Suspense } from "react";
import { PaymentResult } from "@/components/payment-result";

export default function PaymentResultPage() {
  return (
    <Suspense fallback={null}>
      <PaymentResult />
    </Suspense>
  );
}
