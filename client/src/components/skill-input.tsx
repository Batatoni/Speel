import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { InsertCharacter, ProficiencyLevel } from "@shared/schema";
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
  const baseBonus = 2; // Fixed skill value
  const proficiencyLevel = form.watch(name) as ProficiencyLevel;
  const multiplier = Number(proficiencyLevel.slice(1));
  const attributeBonus = Math.floor((attributeValue - 10) / 2);
  const totalBonus = attributeBonus + (baseBonus * multiplier);

  return (
    <div className="space-y-1">
      <Label htmlFor={name} className="text-sm">
        {label} (+{totalBonus})
      </Label>
      <Select
        value={proficiencyLevel}
        onValueChange={(value: ProficiencyLevel) => form.setValue(name as any, value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select proficiency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="x1">×1 Multiplier</SelectItem>
          <SelectItem value="x2">×2 Multiplier</SelectItem>
          <SelectItem value="x3">×3 Multiplier</SelectItem>
          <SelectItem value="x4">×4 Multiplier</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}