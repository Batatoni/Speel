import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { InsertCharacter, ProficiencyLevel, getProficiencyMultiplier } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { number } from "zod";

interface SkillInputProps {
  form: UseFormReturn<InsertCharacter>;
  name: keyof InsertCharacter;
  bonus: keyof InsertCharacter;
  label: string;
  attributeValue: number;
  globalSkillBase: number;
}

export function SkillInput({
  form,
  name,
  bonus,
  label,
  attributeValue,
  globalSkillBase,
}: SkillInputProps) {
  const proficiencyLevel = form.watch(name) as ProficiencyLevel;
  const Bonus = form.watch(bonus) as number;
  const multiplier = getProficiencyMultiplier(proficiencyLevel);
  const attributeBonus = Math.floor((attributeValue - 10) / 2);
  const totalBonus = attributeBonus + Number(Bonus) + (globalSkillBase * multiplier);

  return (
    <div className="space-y-1">
      <Label htmlFor={name} className="text-sm">
        {label} ({totalBonus>=0? '+' + totalBonus : totalBonus})
      </Label>
      <div className="grid grid-cols-12 gap-1">
       <Select   
        value={proficiencyLevel}
        onValueChange={(value: ProficiencyLevel) => form.setValue(name as any, value)}
      >
        <SelectTrigger className="w-full col-span-9">
          <SelectValue placeholder="Select proficiency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          <SelectItem value="trained">Trained</SelectItem>
          <SelectItem value="mastered">Mastered</SelectItem>
          <SelectItem value="supreme">Supreme</SelectItem>
        </SelectContent>
      </Select>      
      <Label className="pt-3 pl-1">+</Label>
      <Input className="w-full col-span-2" id="Bonus" {...form.register(bonus)}/>
      </div>
    </div>
  );
}