import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { InsertCharacter } from "@shared/schema";

interface AttributeInputProps {
  form: UseFormReturn<InsertCharacter>;
  name: "body" | "mind" | "soul";
  label: string;
}

export function AttributeInput({ form, name, label }: AttributeInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-lg font-semibold">
        {label}
      </Label>
      <Input
        type="number"
        id={name}
        min={1}
        max={20}
        {...form.register(name, { valueAsNumber: true })}
        className="text-xl font-bold"
      />
    </div>
  );
}
