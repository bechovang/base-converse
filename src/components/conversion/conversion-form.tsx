"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { BASE_OPTIONS, Base, isValidNumberForBase } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightLeft } from "lucide-react";

const formSchema = z.object({
  number: z.string().min(1, "Số là bắt buộc"),
  sourceBase: z.coerce.number().refine(val => [2, 8, 10, 16].includes(val), "Cơ số nguồn không hợp lệ"),
  targetBase: z.coerce.number().refine(val => [2, 8, 10, 16].includes(val), "Cơ số đích không hợp lệ"),
}).refine(data => isValidNumberForBase(data.number, data.sourceBase as Base), {
  message: "Số không hợp lệ cho cơ số nguồn đã chọn.",
  path: ["number"],
}).refine(data => data.sourceBase !== data.targetBase, {
  message: "Cơ số nguồn và đích không thể giống nhau.",
  path: ["targetBase"], 
});

export type ConversionFormValues = z.infer<typeof formSchema>;

interface ConversionFormProps {
  onSubmit: (data: ConversionFormValues) => void;
  isConverting: boolean;
}

export function ConversionForm({ onSubmit, isConverting }: ConversionFormProps) {
  const form = useForm<ConversionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: "",
      sourceBase: 10,
      targetBase: 2,
    },
  });

  const swapBases = () => {
    const currentSourceBase = form.getValues("sourceBase");
    const currentTargetBase = form.getValues("targetBase");
    const currentNumber = form.getValues("number");
    form.setValue("sourceBase", currentTargetBase);
    form.setValue("targetBase", currentSourceBase);
    if (!isValidNumberForBase(currentNumber, currentTargetBase as Base)) {
      // form.setValue("number", ""); 
    }
    form.trigger(["sourceBase", "targetBase", "number"]); 
  };


  return (
    <Card className="w-full max-w-md mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-primary">Bộ chuyển đổi cơ số</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="number-input">Số cần chuyển đổi</FormLabel>
                  <FormControl>
                    <Input id="number-input" placeholder="Nhập số (vd: 97, 1100001, 61)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between space-x-2">
              <FormField
                control={form.control}
                name="sourceBase"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Từ</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn cơ số nguồn" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BASE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="button" variant="ghost" size="icon" onClick={swapBases} className="self-end mb-1" aria-label="Hoán đổi cơ số">
                <ArrowRightLeft className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </Button>

              <FormField
                control={form.control}
                name="targetBase"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Đến</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn cơ số đích" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BASE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isConverting}>
              {isConverting ? "Đang chuyển đổi..." : "Chuyển đổi"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
