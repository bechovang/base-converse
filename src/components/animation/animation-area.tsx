"use client";

import type { AnimationStep, DecimalToBinaryStep, BinaryToDecimalStep, BinaryToOctalStep, BinaryToHexStep, HexToBinaryStep, OctalToBinaryStep, GenericConversionInfoStep } from "@/types/animation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect, useCallback } from "react";
import { AnimationControls } from "./animation-controls";
import { DecimalToBinaryAnimation } from "./decimal-to-binary-animation";
import { BinaryToDecimalAnimation } from "./binary-to-decimal-animation";
import { BinaryToOctalAnimation } from "./binary-to-octal-animation";
import { BinaryToHexAnimation } from "./binary-to-hex-animation";
import { HexToBinaryAnimation } from "./hex-to-binary-animation";
import { OctalToBinaryAnimation } from "./octal-to-binary-animation";
// Import other specific animation components here, e.g. BinaryToDecimalAnimation
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle } from "lucide-react";

interface AnimationAreaProps {
  steps: AnimationStep[];
  conversionType: string; // e.g., "10-2", "2-10"
}

export function AnimationArea({ steps, conversionType }: AnimationAreaProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1); // 1 = normal speed

  const currentStep = steps[currentStepIndex] || null;

  const resetAnimation = useCallback(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, []);
  
  useEffect(() => {
    resetAnimation();
  }, [steps, resetAnimation]);

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (isPlaying && currentStepIndex < steps.length - 1) {
      timerId = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 1500 / animationSpeed); // Base duration 1.5s, adjust by speed
    } else if (isPlaying && currentStepIndex >= steps.length - 1) {
      setIsPlaying(false); // Stop playing at the end
    }
    return () => clearTimeout(timerId);
  }, [isPlaying, currentStepIndex, steps.length, animationSpeed]);

  const handlePlayPause = () => {
    if (currentStepIndex >= steps.length - 1 && !isPlaying) {
      // If at the end and paused, reset and play
      setCurrentStepIndex(0);
    }
    setIsPlaying(prev => !prev);
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setIsPlaying(false);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setIsPlaying(false);
    }
  };
  
  const handleSpeedChange = (speed: number) => {
    setAnimationSpeed(speed);
  };

  const renderAnimationContent = () => {
    if (!currentStep) {
      return <div className="p-4 text-center text-muted-foreground">Không có bước hoạt ảnh nào hoặc chuyển đổi này không được hỗ trợ hoạt ảnh.</div>;
    }
    // Determine which animation component to render based on step type or conversionType
    if (conversionType === "10-2" && 
        (currentStep.type === "INITIAL" || 
         currentStep.type === "PROCESS_DECIMAL_POWER_STEP" ||
         currentStep.type === "FINAL_RESULT")) {
      return <DecimalToBinaryAnimation step={currentStep as DecimalToBinaryStep} />;
    }
    // Add other conditions for BinaryToDecimal, etc.
    if (conversionType === "2-10" && 
        (currentStep.type === "INITIAL" || 
         currentStep.type === "CALCULATE_BIT_VALUE" || 
         currentStep.type === "ADD_TO_SUM" || 
         currentStep.type === "FINAL_RESULT")) {
      return <BinaryToDecimalAnimation step={currentStep as BinaryToDecimalStep} />;
    }
    if (conversionType === "2-8" && 
        (currentStep.type === "INITIAL" || 
         currentStep.type === "SHOW_GROUPS" || 
         currentStep.type === "PROCESS_GROUP" || 
         currentStep.type === "FINAL_RESULT")) {
      return <BinaryToOctalAnimation step={currentStep as BinaryToOctalStep} />;
    }
    if (conversionType === "2-16" && 
        (currentStep.type === "INITIAL" || 
         currentStep.type === "SHOW_GROUPS_HEX" || 
         currentStep.type === "PROCESS_GROUP_HEX" || 
         currentStep.type === "FINAL_RESULT_HEX")) {
      return <BinaryToHexAnimation step={currentStep as BinaryToHexStep} />;
    }
    if (conversionType === "16-2" && 
        (currentStep.type === "INITIAL_HEX_TO_BIN" || 
         currentStep.type === "PROCESS_HEX_DIGIT" || 
         currentStep.type === "FINAL_RESULT_HEX_TO_BIN")) {
      return <HexToBinaryAnimation step={currentStep as HexToBinaryStep} />;
    }
    if (conversionType === "8-2" && 
        (currentStep.type === "INITIAL_OCT_TO_BIN" || 
         currentStep.type === "PROCESS_OCT_DIGIT" || 
         currentStep.type === "FINAL_RESULT_OCT_TO_BIN")) {
      return <OctalToBinaryAnimation step={currentStep as OctalToBinaryStep} />;
    }
    if (currentStep.type === "GENERIC_INFO") {
      const genericStep = currentStep as GenericConversionInfoStep;
      return (
        <div className="p-4 space-y-3 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-blue-500 mb-3" />
          <h3 className="text-xl font-semibold text-primary">{genericStep.message}</h3>
          <p className="text-muted-foreground">
            Chuyển đổi trực tiếp từ <span className="font-semibold">{genericStep.fromBaseLabel}</span> sang <span className="font-semibold">{genericStep.toBaseLabel}</span>:
          </p>
          <p className="font-mono text-lg">
            <span className="text-primary">{genericStep.inputValue}</span> ({genericStep.fromBaseLabel}) → <span className="text-green-500">{genericStep.outputValue}</span> ({genericStep.toBaseLabel})
          </p>
          {genericStep.recommendation && 
            <p className="text-sm text-muted-foreground mt-2 italic bg-muted p-2 rounded-md">
              {(() => {
                const parts = genericStep.recommendation.split('. ');
                const pathPart = parts[0];
                const referencePart = parts.length > 1 ? parts.slice(1).join('. ') : null;
                return (
                  <>
                    <strong className="text-primary/90 font-semibold">{pathPart}.</strong>
                    {referencePart && <span className="ml-1">{referencePart}</span>}
                  </>
                );
              })()}
            </p>
          }
          <p className="text-xs text-muted-foreground mt-4">Hoạt ảnh chi tiết cho loại chuyển đổi này chưa được triển khai.</p>
        </div>
      );
    }

    // Fallback for unhandled step types or conversion types
    return (
        <div className="p-4 text-center text-muted-foreground">
            <AlertCircle className="mx-auto h-10 w-10 text-yellow-500 mb-2" />
            <p>Hoạt ảnh cho bước này hoặc loại chuyển đổi ({conversionType}) này chưa được triển khai.</p>
            <p className="text-xs mt-2">Chi tiết bước: {JSON.stringify(currentStep, null, 2)}</p>
        </div>
    );
  };

  if (!steps || steps.length === 0) {
    return (
       <Card className="mt-6 w-full shadow-xl">
        <CardHeader>
          <CardTitle>Hoạt ảnh từng bước</CardTitle>
          <CardDescription>Minh họa trực quan của quá trình chuyển đổi.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">Thực hiện chuyển đổi để xem hoạt ảnh.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6 w-full shadow-xl">
      <CardHeader>
        <CardTitle>Hoạt ảnh từng bước</CardTitle>
        <CardDescription>
          Đang minh họa: {steps[0]?.explanation?.split('.')[0] || 'Quá trình chuyển đổi'} (Bước {currentStepIndex + 1} của {steps.length})
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[450px] w-full p-4">
           {renderAnimationContent()}
        </ScrollArea>
        <AnimationControls
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNextStep={handleNextStep}
          onPrevStep={handlePrevStep}
          onReset={resetAnimation}
          canNext={currentStepIndex < steps.length - 1}
          canPrev={currentStepIndex > 0}
          animationSpeed={animationSpeed}
          onSpeedChange={handleSpeedChange}
        />
      </CardContent>
    </Card>
  );
}
