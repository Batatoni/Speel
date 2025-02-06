import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { InsertCharacter, ProficiencyLevel, getProficiencyMultiplier } from "@shared/schema";

interface SkillInputProps {
  form: UseFormReturn<InsertCharacter>;
  name: keyof InsertCharacter;
  label: string;
  attributeValue: number;
  globalSkillBase: number;
}

export function SkillInput({
  form,
  name,
  label,
  attributeValue,
  globalSkillBase,
}: SkillInputProps) {
  const proficiencyLevel = form.watch(name) as ProficiencyLevel;
  const multiplier = getProficiencyMultiplier(proficiencyLevel);
  const attributeBonus = Math.floor((attributeValue - 10) / 2);
  const totalBonus = attributeBonus + (globalSkillBase * multiplier);

  return (
    <div className="space-y-1">
      <Label htmlFor={name} className="text-sm">
        {label} ({totalBonus>=0? '+'+totalBonus : totalBonus})
      </Label>
      <Select
        value={proficiencyLevel}
        onValueChange={(value: ProficiencyLevel) => form.setValue(name as any, value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select proficiency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          <SelectItem value="trained">Trained</SelectItem>
          <SelectItem value="mastered">Mastered</SelectItem>
          <SelectItem value="supreme">Supreme</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}