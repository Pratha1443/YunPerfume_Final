import { Suspense } from "react";
import SuccessContent from "./success-content";

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}
