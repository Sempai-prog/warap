"use client";

import { useRouter } from "next/navigation";
import { IdentityForm } from "@/components/onboarding/IdentityForm";
import { DesignForm } from "@/components/onboarding/DesignForm";
import { BusinessForm } from "@/components/onboarding/BusinessForm";

export function IdentityFormWrapper() {
    const router = useRouter();
    return <IdentityForm onNext={() => router.refresh()} />;
}

export function DesignFormWrapper() {
    const router = useRouter();
    return <DesignForm onNext={() => router.refresh()} onBack={() => {}} />;
}

export function BusinessFormWrapper() {
    const router = useRouter();
    return <BusinessForm onBack={() => {}} />;
}
