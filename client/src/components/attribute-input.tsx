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
  export function CoreChange(fragments: number): number {
    var core = 0;
    if (fragments>= 7000)
      core = 8;
    else if (fragments>= 5250)
      core = 7;
    else if (fragments>= 3750)
      core = 6;
    else if (fragments>= 2500)
      core = 5;
    else if (fragments>= 1500)
      core = 4;
    else if (fragments>= 750)
      core = 3;
    else if (fragments>= 250)
      core = 2;
    else
      core = 1;
    return core
  }

