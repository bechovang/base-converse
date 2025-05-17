"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

interface ConversionResultProps {
  result: string;
  fromBaseLabel: string;
  toBaseLabel: string;
  originalInput: string;
}

export function ConversionResult({ result, fromBaseLabel, toBaseLabel, originalInput }: ConversionResultProps) {
  const { toast } = useToast();

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(result)
      .then(() => {
        toast({
          title: "Đã sao chép vào bộ nhớ tạm!",
          description: `Kết quả "${result}" đã được sao chép.`,
        });
      })
      .catch(err => {
        console.error("Không thể sao chép: ", err);
        toast({
          title: "Lỗi",
          description: "Không thể sao chép kết quả vào bộ nhớ tạm.",
          variant: "destructive",
        });
      });
  };

  if (!result) return null;

  return (
    <Card className="w-full max-w-md mx-auto mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-center">Kết quả chuyển đổi</CardTitle>
        <CardDescription className="text-center">
          {originalInput} ({fromBaseLabel}) =
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <div className="flex items-center justify-center space-x-2">
          <p className="text-3xl font-bold text-primary break-all">{result}</p>
          <Button variant="ghost" size="icon" onClick={handleCopyToClipboard} aria-label="Sao chép kết quả">
            <Copy className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">({toBaseLabel})</p>
      </CardContent>
    </Card>
  );
}
