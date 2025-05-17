"use client";

import { useEffect, useState } from "react";
import { getSupplementalContent, SupplementalContentInput } from "@/ai/flows/supplemental-education";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

interface SupplementalContentProps {
  input: SupplementalContentInput | null;
}

export function SupplementalContent({ input }: SupplementalContentProps) {
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (input) {
      setIsLoading(true);
      setError(null);
      setContent(null);
      getSupplementalContent(input)
        .then(response => {
          setContent(response.content);
        })
        .catch(err => {
          console.error("Lỗi khi tìm nạp nội dung bổ sung:", err);
          setError("Không thể tải nội dung giáo dục. Vui lòng thử lại.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setContent(null);
      setError(null);
      setIsLoading(false);
    }
  }, [input]);

  if (!input && !isLoading && !content) {
     return (
      <Card className="mt-6 w-full shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-6 w-6 text-primary" />
            Tìm hiểu thêm
          </CardTitle>
          <CardDescription>
            Thông tin bổ sung về việc chuyển đổi của bạn sẽ xuất hiện ở đây.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Thực hiện chuyển đổi để xem nội dung học tập liên quan.</p>
        </CardContent>
      </Card>
    );
  }


  return (
    <Card className="mt-6 w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
           <Terminal className="h-6 w-6 text-primary" />
           Tìm hiểu thêm
        </CardTitle>
        {input && <CardDescription>Thông tin giáo dục chuyên sâu cho việc chuyển đổi {input.number} từ cơ số {input.sourceBase} sang cơ số {input.targetBase}.</CardDescription>}
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        )}
        {error && (
           <Alert variant="destructive">
             <Terminal className="h-4 w-4" />
             <AlertTitle>Lỗi</AlertTitle>
             <AlertDescription>{error}</AlertDescription>
           </Alert>
        )}
        {content && !isLoading && (
          <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-line">
            {content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4 last:mb-0">{paragraph}</p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
