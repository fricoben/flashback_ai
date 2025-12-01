import { Suspense } from "react";
import SuccessContent from "./success-content";

function LoadingFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-[#E8C547]" />
        <p className="mt-6 text-lg text-white/60">Loading...</p>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessContent />
    </Suspense>
  );
}
