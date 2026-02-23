"use client";

import { useState } from "react";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { IdentityForm } from "@/components/onboarding/IdentityForm";
import { DesignForm } from "@/components/onboarding/DesignForm";
import { BusinessForm } from "@/components/onboarding/BusinessForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-none shadow-2xl shadow-primary-900/5 rounded-[2rem]">
        <CardHeader className="text-center pb-2 pt-8">
            <StepIndicator step={step} />
            <CardTitle className="text-2xl font-bold mt-4">
                {step === 1 && "Identité de votre boutique"}
                {step === 2 && "Personnalisez votre style"}
                {step === 3 && "Configuration Business"}
            </CardTitle>
            <CardDescription>
                {step === 1 && "Dites-nous en plus sur votre commerce"}
                {step === 2 && "Choisissez l'apparence de votre boutique"}
                {step === 3 && "Configurez vos paiements et livraisons"}
            </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
            {step === 1 && <IdentityForm onNext={nextStep} />}
            {step === 2 && <DesignForm onNext={nextStep} onBack={prevStep} />}
            {step === 3 && <BusinessForm onBack={prevStep} />}
        </CardContent>
      </Card>
    </div>
  );
}
