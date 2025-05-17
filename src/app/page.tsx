
"use client";

import { useState } from "react";
import { ConversionForm, type ConversionFormValues } from "@/components/conversion/conversion-form";
import { ConversionResult } from "@/components/conversion/conversion-result";
import { SupplementalContent } from "@/components/ai/supplemental-content";
import type { SupplementalContentInput } from "@/ai/flows/supplemental-education";
import { convertNumber } from "@/lib/conversion";
import { useToast } from "@/hooks/use-toast";
import type { AnimationStep } from "@/types/animation";
import { AnimationArea } from "@/components/animation/animation-area";
import { getBaseLabel, type Base } from "@/lib/constants";
import { ConversionNotes } from "@/components/conversion/conversion-notes"; // Added import

export default function HomePage() {
  const [conversionResult, setConversionResult] = useState<string | null>(null);
  const [originalInput, setOriginalInput] = useState<string>("");
  const [fromBaseLabel, setFromBaseLabel] = useState<string>("");
  const [toBaseLabel, setToBaseLabel] = useState<string>("");
  const [supplementalInput, setSupplementalInput] = useState<SupplementalContentInput | null>(null);
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [currentConversionType, setCurrentConversionType] = useState<string>("");
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  const handleConversion = async (data: ConversionFormValues) => {
    setIsConverting(true);
    setConversionResult(null);
    setAnimationSteps([]);
    setSupplementalInput(null);

    try {
      const { result, steps, explanation } = await convertNumber(
        data.number,
        data.sourceBase as Base,
        data.targetBase as Base
      );

      if (explanation && !result) { // Handle errors from convertNumber
         toast({ title: "Lỗi chuyển đổi", description: explanation, variant: "destructive" });
         setConversionResult(null);
      } else {
        setConversionResult(result);
        setAnimationSteps(steps);
        setCurrentConversionType(`${data.sourceBase}-${data.targetBase}`);
        setOriginalInput(data.number);
        setFromBaseLabel(getBaseLabel(data.sourceBase as Base));
        setToBaseLabel(getBaseLabel(data.targetBase as Base));

        setSupplementalInput({
          number: data.number,
          sourceBase: data.sourceBase,
          targetBase: data.targetBase,
        });
      }
    } catch (error) {
      console.error("Chuyển đổi thất bại:", error);
      const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định.";
      toast({
        title: "Lỗi chuyển đổi",
        description: errorMessage,
        variant: "destructive",
      });
      setConversionResult(null);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="w-full lg:w-1/3 lg:sticky lg:top-8 space-y-6">
        <ConversionForm onSubmit={handleConversion} isConverting={isConverting} />
        {conversionResult && (
          <ConversionResult
            result={conversionResult}
            originalInput={originalInput}
            fromBaseLabel={fromBaseLabel}
            toBaseLabel={toBaseLabel}
          />
        )}
         {/* Added ConversionNotes here, outside of conditional rendering */}
        <ConversionNotes />
      </div>

      <div className="w-full lg:w-2/3 space-y-6">
        <AnimationArea steps={animationSteps} conversionType={currentConversionType} />
        <SupplementalContent input={supplementalInput} />
      </div>
    </div>
  );
}
