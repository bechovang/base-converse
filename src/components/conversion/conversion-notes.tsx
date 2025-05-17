
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export function ConversionNotes() {
  return (
    <Card className="w-full max-w-md mx-auto mt-6 shadow-lg lg:max-w-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-primary">
          <Lightbulb className="h-5 w-5" />
          Lưu ý chiến lược chuyển đổi
        </CardTitle>
        <CardDescription>
          Gợi ý để chuyển đổi cơ số dễ dàng và trực quan hơn.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <h4 className="font-semibold text-foreground/90">Chuyển đổi 10 ↔ 16 và 10 ↔ 8:</h4>
          <ul className="list-disc pl-5 space-y-1 mt-1 text-muted-foreground">
            <li>
              <strong>10 → 16 (Thập phân sang Thập lục phân):</strong> Nên chuyển theo <code className="font-mono bg-muted px-1 py-0.5 rounded">10 → 2 → 16</code>.
              <ul className="list-circle pl-5 mt-0.5">
                <li>Từ thập phân sang nhị phân trực quan hơn.</li>
                <li>Rồi từ nhị phân sang hệ 16 chỉ cần nhóm 4 bit.</li>
              </ul>
            </li>
            <li>
              <strong>10 → 8 (Thập phân sang Bát phân):</strong> Nên chuyển theo <code className="font-mono bg-muted px-1 py-0.5 rounded">10 → 2 → 8</code>.
              <ul className="list-circle pl-5 mt-0.5">
                <li>Nhị phân dễ hình dung.</li>
                <li>Rồi nhóm 3 bit sang hệ 8.</li>
              </ul>
            </li>
            <li>
              <strong>16 → 10 (Thập lục phân sang Thập phân)</strong> hoặc <strong>8 → 10 (Bát phân sang Thập phân):</strong> Nên chuyển theo <code className="font-mono bg-muted px-1 py-0.5 rounded">16/8 → 2 → 10</code>.
              <ul className="list-circle pl-5 mt-0.5">
                <li>Từ hệ 16/8 sang nhị phân dễ nhớ (mỗi ký tự 16/8 tương ứng 4/3 bit nhị phân).</li>
                <li>Rồi nhẩm giá trị các vị trí bit để tính ra hệ 10.</li>
              </ul>
            </li>
          </ul>
          <p className="mt-2 text-xs text-muted-foreground/80">
            <span className="font-semibold">Lưu ý:</span> Tránh chuyển trực tiếp giữa <code className="font-mono bg-muted px-1 py-0.5 rounded">10 ↔ 16</code> hoặc <code className="font-mono bg-muted px-1 py-0.5 rounded">10 ↔ 8</code> bằng cách chia/nhân liên tục với 16 hoặc 8 — phương pháp này thường dài dòng và dễ gây nhầm lẫn hơn.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
