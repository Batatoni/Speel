import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { InsertCharacter } from "@shared/schema";
import { calculateSkillBonus } from "@/lib/calculations";

interface SkillInputProps {
  form: UseFormReturn<InsertCharacter>;
  name: keyof InsertCharacter;
  label: string;
  attributeValue: number;
}

export function SkillInput({
  form,
  name,
  label,
  attributeValue,
}: SkillInputProps) {
  const bonus = calculateSkillBonus(attributeValue);

  return (
    <div className="space-y-1">
      <Label htmlFor={name} className="text-sm">
        {label} (+{bonus})
      </Label>
      <Input
        type="number"
        id={name}
        min={1}
        max={20}
        {...form.register(name, { valueAsNumber: true })}
      />
    </div>
  );
}
