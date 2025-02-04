import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { InsertCharacter, ProficiencyLevel, getProficiencyMultiplier } from "@shared/schema";

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
  const baseName = `${name}Base` as keyof InsertCharacter;
  const baseValue = form.watch(baseName) as number;
  const proficiencyLevel = form.watch(name) as ProficiencyLevel;
  const multiplier = getProficiencyMultiplier(proficiencyLevel);
  const attributeBonus = Math.floor((attributeValue - 10) / 2);
  const totalBonus = attributeBonus + (baseValue * multiplier);

  return (
    <div className="space-y-1">
      <Label htmlFor={name} className="text-sm">
        {label} (+{totalBonus})
      </Label>
      <div className="flex gap-2">
        <Input
          type="number"
          id={baseName}
          min={0}
          {...form.register(baseName, { valueAsNumber: true })}
          className="w-20"
          placeholder="Base"
        />
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
    </div>
  );
}