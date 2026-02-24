"use client";

import { useRouter } from "next/navigation";
import { IdentityForm } from "@/components/onboarding/IdentityForm";
import { DesignForm } from "@/components/onboarding/DesignForm";
import { BusinessForm } from "@/components/onboarding/BusinessForm";

export function IdentityFormWrapper() {
  const router = useRouter();
  // In Settings, we don't necessarily want to go to the next step, but just refresh or Close.
  // However, the Onboarding forms are designed for a flow.
  // For now, refresh is a good catch-all.
  return (
    <IdentityForm
      onNext={() => {
        router.refresh();
        // Since it's inside a modal, ideally the modal should close.
        // We'll handle modal closing in the parent via state, or use a custom "onComplete" prop later.
      }}
    />
  );
}

export function DesignFormWrapper() {
  const router = useRouter();
  return <DesignForm onNext={() => router.refresh()} onBack={() => {}} />;
}

export function BusinessFormWrapper() {
  const router = useRouter();
  return <BusinessForm onBack={() => {}} />;
}
