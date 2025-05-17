"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, SkipForward, SkipBack, FastForward, RewindIcon } from "lucide-react";
import { Label } from "@/components/ui/label";

interface AnimationControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onReset: () => void;
  canNext: boolean;
  canPrev: boolean;
  animationSpeed: number;
  onSpeedChange: (speed: number) => void;
}

const speedOptions = [
  { label: "0.5x", value: 0.5 },
  { label: "1x (Normal)", value: 1 },
  { label: "1.5x", value: 1.5 },
  { label: "2x", value: 2 },
];

export function AnimationControls({
  isPlaying,
  onPlayPause,
  onNextStep,
  onPrevStep,
  onReset,
  canNext,
  canPrev,
  animationSpeed,
  onSpeedChange,
}: AnimationControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t bg-card-foreground/5 rounded-b-lg">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onReset} aria-label="Reset animation">
          <RewindIcon className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onPrevStep} disabled={!canPrev || isPlaying} aria-label="Previous step">
          <SkipBack className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" onClick={onPlayPause} aria-label={isPlaying ? "Pause animation" : "Play animation"}>
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={onNextStep} disabled={!canNext || isPlaying} aria-label="Next step">
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Label htmlFor="speed-select" className="text-sm">Speed:</Label>
        <Select
          value={animationSpeed.toString()}
          onValueChange={(value) => onSpeedChange(parseFloat(value))}
        >
          <SelectTrigger id="speed-select" className="w-[120px] h-9">
            <SelectValue placeholder="Speed" />
          </SelectTrigger>
          <SelectContent>
            {speedOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value.toString()}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
