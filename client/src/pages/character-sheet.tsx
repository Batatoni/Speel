import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCharacterSchema, type InsertCharacter, calculateDamageReduction } from "@shared/schema";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttributeInput } from "@/components/attribute-input";
import { SkillInput } from "@/components/skill-input";
import { calculateMaxHp } from "@/lib/calculations";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";

export default function CharacterSheet() {
  const { toast } = useToast();
  const [globalSkillBase, setGlobalSkillBase] = useState(0);
  const [incomingDamage, setIncomingDamage] = useState(0);

  const form = useForm<InsertCharacter>({
    resolver: zodResolver(insertCharacterSchema),
    defaultValues: {
      name: "",
      body: 10,
      mind: 10,
      soul: 10,
      // Initialize all skills with 'none' level
      strength: "none",
      strengthBase: 0,
      agility: "none",
      agilityBase: 0,
      endurance: "none",
      enduranceBase: 0,
      intelligence: "none",
      intelligenceBase: 0,
      wisdom: "none",
      wisdomBase: 0,
      charisma: "none",
      charismaBase: 0,
      willpower: "none",
      willpowerBase: 0,
      intuition: "none",
      intuitionBase: 0,
      presence: "none",
      presenceBase: 0,
      // Equipment
      armorName: "",
      armorValue: 0,
      shieldName: "",
      shieldValue: 0,
      weaponName: "",
      weaponDamage: 0,
      // HP
      currentHp: 50,
      maxHp: 50,
    },
  });

  const { data: characters } = useQuery({
    queryKey: ["/api/characters"],
  });

  const { mutate: saveCharacter, isPending } = useMutation({
    mutationFn: async (data: InsertCharacter) => {
      const updatedData = {
        ...data,
        strengthBase: globalSkillBase,
        agilityBase: globalSkillBase,
        enduranceBase: globalSkillBase,
        intelligenceBase: globalSkillBase,
        wisdomBase: globalSkillBase,
        charismaBase: globalSkillBase,
        willpowerBase: globalSkillBase,
        intuitionBase: globalSkillBase,
        presenceBase: globalSkillBase,
      };
      await apiRequest("POST", "/api/characters", updatedData);
    },
    onSuccess: () => {
      toast({
        title: "Character Saved",
        description: "Your character has been saved successfully.",
      });
    },
  });

  const watchBody = form.watch("body");
  const maxHp = calculateMaxHp(watchBody);
  form.setValue("maxHp", maxHp);

  const handleDamageCalculation = () => {
    const armorValue = form.watch("armorValue");
    const shieldValue = form.watch("shieldValue");
    
    const getEnduranceMultiplier = (proficiency: string) => {
      switch (proficiency) {
        case "none":
          return 1;
        case "trained":
          return 2;
        case "mastered":
          return 3;
        case "supreme":
          return 4;
        default:
          return 0;
      }
    };

    const enduranceBonus = Math.floor((watchBody - 10) / 2) + (globalSkillBase * getEnduranceMultiplier(form.watch("endurance")));

    const totalDamage = calculateDamageReduction(
      incomingDamage,
      armorValue + shieldValue,
      enduranceBonus
    );

    const newHp = Math.max(0, form.watch("currentHp") - Math.floor(totalDamage));
    form.setValue("currentHp", newHp);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            Character Sheet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => saveCharacter(data))} className="space-y-8">
              <div className="space-y-4">
                <Label htmlFor="name">Character Name</Label>
                <Input id="name" {...form.register("name")} className="text-xl" />
              </div>

              {/* Attributes and Skills */}
              <div className="grid grid-cols-3 gap-8">
                {/* Body Section */}
                <div className="space-y-4">
                  <AttributeInput form={form} name="body" label="Body" />
                  <div className="pt-4 space-y-4">
                    <SkillInput form={form} name="strength" label="Strength" attributeValue={watchBody} globalSkillBase={globalSkillBase} />
                    <SkillInput form={form} name="agility" label="Agility" attributeValue={watchBody} globalSkillBase={globalSkillBase} />
                    <SkillInput form={form} name="endurance" label="Endurance" attributeValue={watchBody} globalSkillBase={globalSkillBase} />
                  </div>
                </div>

                {/* Mind Section */}
                <div className="space-y-4">
                  <AttributeInput form={form} name="mind" label="Mind" />
                  <div className="pt-4 space-y-4">
                    <SkillInput form={form} name="intelligence" label="Intelligence" attributeValue={form.watch("mind")} globalSkillBase={globalSkillBase} />
                    <SkillInput form={form} name="wisdom" label="Wisdom" attributeValue={form.watch("mind")} globalSkillBase={globalSkillBase} />
                    <SkillInput form={form} name="charisma" label="Charisma" attributeValue={form.watch("mind")} globalSkillBase={globalSkillBase} />
                  </div>
                </div>

                {/* Soul Section */}
                <div className="space-y-4">
                  <AttributeInput form={form} name="soul" label="Soul" />
                  <div className="pt-4 space-y-4">
                    <SkillInput form={form} name="willpower" label="Willpower" attributeValue={form.watch("soul")} globalSkillBase={globalSkillBase} />
                    <SkillInput form={form} name="intuition" label="Intuition" attributeValue={form.watch("soul")} globalSkillBase={globalSkillBase} />
                    <SkillInput form={form} name="presence" label="Presence" attributeValue={form.watch("soul")} globalSkillBase={globalSkillBase} />
                  </div>
                </div>
              </div>

              {/* Global Skill Base */}
              <div className="space-y-4">
                <Label>Global Skill Base Value</Label>
                <Input
                  type="number"
                  min={0}
                  value={globalSkillBase}
                  onChange={(e) => setGlobalSkillBase(Number(e.target.value))}
                  className="w-32"
                />
              </div>

              {/* Equipment Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Equipment</h3>
                <div className="grid grid-cols-3 gap-4">
                  {/* Armor */}
                  <div className="space-y-2">
                    <Label>Armor</Label>
                    <Input {...form.register("armorName")} placeholder="Armor Name" />
                    <Input type="number" {...form.register("armorValue", { valueAsNumber: true })} placeholder="Armor Value" />
                  </div>
                  {/* Shield */}
                  <div className="space-y-2">
                    <Label>Shield</Label>
                    <Input {...form.register("shieldName")} placeholder="Shield Name" />
                    <Input type="number" {...form.register("shieldValue", { valueAsNumber: true })} placeholder="Shield Value" />
                  </div>
                  {/* Weapon */}
                  <div className="space-y-2">
                    <Label>Weapon</Label>
                    <Input {...form.register("weaponName")} placeholder="Weapon Name" />
                    <Input type="number" {...form.register("weaponDamage", { valueAsNumber: true })} placeholder="Weapon Damage" />
                  </div>
                </div>
              </div>

              {/* Health and Damage Section */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>HP ({form.watch("currentHp")}/{maxHp})</Label>
                  <Progress value={(form.watch("currentHp") / maxHp) * 100} className="h-4" />
                  <Input
                    type="number"
                    {...form.register("currentHp", { valueAsNumber: true })}
                    min={0}
                    max={maxHp}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Damage Calculator</Label>
                  <div className="flex gap-4">
                    <Input
                      type="number"
                      min={0}
                      value={incomingDamage}
                      onChange={(e) => setIncomingDamage(Number(e.target.value))}
                      placeholder="Incoming Damage"
                      className="w-32"
                    />
                    <Button type="button" onClick={handleDamageCalculation}>
                      Calculate Damage
                    </Button>
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={isPending} className="w-full">
                Save Character
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

function getProficiencyMultiplier(proficiency: string): number {
  switch (proficiency) {
    case "master":
      return 2;
    case "expert":
      return 1.5;
    default:
      return 1;
  }
}