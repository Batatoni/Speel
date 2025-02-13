import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  insertCharacterSchema,
  type InsertCharacter,
  calculateDamageReduction,
} from "@shared/schema";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttributeInput } from "@/components/attribute-input";
import { SkillInput } from "@/components/skill-input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { SetDiceValue } from "@/lib/calculations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { boolean } from "drizzle-orm/pg-core";
import Input_ from "postcss/lib/input";
import { Download, Upload } from "lucide-react";

export default function CharacterSheet() {
  const { toast } = useToast();
  const [globalSkillBase, setGlobalSkillBase] = useState(1);
  const [incomingDamage, setIncomingDamage] = useState(0);

  const form = useForm<InsertCharacter>({
    resolver: zodResolver(insertCharacterSchema),
    defaultValues: {
      name: "",
      rank: "Sleeper",
      body: 10,
      mind: 10,
      soul: 10,
      // Initialize all skills with 'none' level
      strength: "none",
      strengthBase: 0,
      strengthBonus: 0,
      agility: "none",
      agilityBase: 0,
      agilityBonus: 0,
      endurance: "none",
      enduranceBase: 0,
      enduranceBonus: 0,
      intelligence: "none",
      intelligenceBase: 0,
      intelligenceBonus: 0,
      wisdom: "none",
      wisdomBase: 0,
      wisdomBonus: 0,
      charisma: "none",
      charismaBase: 0,
      charismaBonus: 0,
      willpower: "none",
      willpowerBase: 0,
      willpowerBonus: 0,
      intuition: "none",
      intuitionBase: 0,
      intuitionBonus: 0,
      presence: "none",
      presenceBase: 0,
      presenceBonus: 0,
      dicevalue: "1d4",
      // Equipment
      armorName: "",
      armorValue: 0,
      shieldName: "",
      shieldValue: 0,
      shieldonoff: false,
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
  const maxHp = 50;

  const handleDamageCalculation = () => {
    const armorValue = form.watch("armorValue");
    const shieldValue = form.watch("shieldValue");
    const shieldonoff = form.watch("shieldonoff");
    console.log(shieldonoff);

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

    const enduranceBonus =
      Math.floor((watchBody - 10) / 2) +
      globalSkillBase * getEnduranceMultiplier(form.watch("endurance"));

    const totalDamage = calculateDamageReduction(
      incomingDamage,
      shieldonoff ? armorValue + shieldValue : armorValue,
      enduranceBonus
    );

    const newHp = Math.max(form.watch("currentHp") - Math.ceil(totalDamage));
    form.setValue("currentHp", newHp);
  };

  const handleExportCharacter = () => {
    const characterData = form.getValues();
    const blob = new Blob([JSON.stringify(characterData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${characterData.name || form.watch("name")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const handleImportCharacter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const character = JSON.parse(e.target?.result as string);
          form.reset(character);
          toast({
            title: "Character Imported",
            description: "Character data has been loaded successfully.",  
          });
        } catch (error) {
          toast({
            title: "Import Error",
            description: "Failed to import character data.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
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
            <form
              onSubmit={form.handleSubmit((data) => saveCharacter(data))}
              className="space-y-8"
            >
              <div className="space-y-4">
                <Label htmlFor="name">Character Name</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  className="text-xl"
                />
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-4">
                  <Label>Character Rank</Label>
                  <Select
                    onValueChange={(value: string) =>
                      form.setValue("dicevalue", SetDiceValue(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Rank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sleeper">Sleeper</SelectItem>
                      <SelectItem value="Awakened">Awakened</SelectItem>
                      <SelectItem value="Ascendant">Ascendant</SelectItem>
                      <SelectItem value="Transcendent">Transcendent</SelectItem>
                      <SelectItem value="Sovereign">Sovereign</SelectItem>
                      <SelectItem value="Sacred">Sacred</SelectItem>
                      <SelectItem value="Divine">Divine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label>Character Dice</Label>
                  <Input
                    id="name"
                    className="text-xl"
                    {...form.register("dicevalue")}
                    readOnly
                  />
                </div>
                {/* Global Skill Base */}
                <div className="flex justify-center items-center space-x-2 mt-10">
                  <Label className="text-[20px]">Soul Cores:</Label>
                  <Input
                    className="w-20 text-center text-xl"
                    min={0}
                    value={globalSkillBase}
                    onChange={(e) => setGlobalSkillBase(Number(e.target.value))}
                  />
                  <Label className="text-[20px]">Max: 7</Label>
                </div>
              </div>

              {/* Attributes and Skills */}
              <div className="grid grid-cols-3 gap-8">
                {/* Body Section */}
                <div className="space-y-4">
                  <AttributeInput form={form} name="body" label="Body" />
                  <div className="pt-4 space-y-4">
                    <SkillInput
                      form={form}
                      name="strength"
                      bonus="strengthBonus"
                      label="Strength"
                      attributeValue={watchBody}
                      globalSkillBase={globalSkillBase}
                    />
                    <SkillInput
                      form={form}
                      name="agility"
                      bonus="agilityBonus"
                      label="Agility"
                      attributeValue={watchBody}
                      globalSkillBase={globalSkillBase}
                    />
                    <SkillInput
                      form={form}
                      name="endurance"
                      bonus="enduranceBonus"
                      label="Endurance"
                      attributeValue={watchBody}
                      globalSkillBase={globalSkillBase}
                    />
                  </div>
                </div>

                {/* Mind Section */}
                <div className="space-y-4">
                  <AttributeInput form={form} name="mind" label="Mind" />
                  <div className="pt-4 space-y-4">
                    <SkillInput
                      form={form}
                      name="intelligence"
                      bonus="intelligenceBonus"
                      label="Intelligence"
                      attributeValue={form.watch("mind")}
                      globalSkillBase={globalSkillBase}
                    />
                    <SkillInput
                      form={form}
                      name="wisdom"
                      bonus="wisdomBonus"
                      label="Wisdom"
                      attributeValue={form.watch("mind")}
                      globalSkillBase={globalSkillBase}
                    />
                    <SkillInput
                      form={form}
                      name="charisma"
                      bonus="charismaBonus"
                      label="Charisma"
                      attributeValue={form.watch("mind")}
                      globalSkillBase={globalSkillBase}
                    />
                  </div>
                </div>

                {/* Soul Section */}
                <div className="space-y-4">
                  <AttributeInput form={form} name="soul" label="Soul" />
                  <div className="pt-4 space-y-4">
                    <SkillInput
                      form={form}
                      name="willpower"
                      bonus="willpowerBonus"
                      label="Willpower"
                      attributeValue={form.watch("soul")}
                      globalSkillBase={globalSkillBase}
                    />
                    <SkillInput
                      form={form}
                      name="intuition"
                      bonus="intuitionBonus"
                      label="Intuition"
                      attributeValue={form.watch("soul")}
                      globalSkillBase={globalSkillBase}
                    />
                    <SkillInput
                      form={form}
                      name="presence"
                      bonus="presenceBonus"
                      label="Presence"
                      attributeValue={form.watch("soul")}
                      globalSkillBase={globalSkillBase}
                    />
                  </div>
                </div>
              </div>

              {/* Equipment Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Equipment</h3>
                <div className="grid grid-cols-3 gap-4">
                  {/* Armor */}
                  <div className="space-y-2">
                    <Label>Armor</Label>
                    <Input
                      {...form.register("armorName")}
                      placeholder="Armor Name"
                    />
                    <Input
                      type="number"
                      {...form.register("armorValue", { valueAsNumber: true })}
                      placeholder="Armor Value"
                    />
                  </div>
                  {/* Shield */}
                  <div className="space-y-2">
                    <Label>Shield</Label>
                    <Input
                      {...form.register("shieldName")}
                      placeholder="Shield Name"
                    />
                    <Input
                      type="number"
                      {...form.register("shieldValue", { valueAsNumber: true })}
                      placeholder="Shield Value"
                    />
                  </div>
                  {/* Weapon */}
                  <div className="space-y-2">
                    <Label>Weapon</Label>
                    <Input
                      {...form.register("weaponName")}
                      placeholder="Weapon Name"
                    />
                    <Input type="text" placeholder="Weapon Damage" />
                  </div>
                </div>
              </div>

              {/* Health and Damage Section */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>
                    HP ({form.watch("currentHp")}/{form.watch("maxHp")})
                  </Label>
                  <Progress
                    value={
                      (form.watch("currentHp") / form.watch("maxHp")) * 100
                    }
                    className="h-4"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-4">
                    <Label>MaxHP</Label>
                    <Input
                      type="number"
                      {...form.register("maxHp", { valueAsNumber: true })}
                      min={0}
                    />
                  </div>
                  <div className="space-y-4">
                    <Label>CurrentHP</Label>
                    <Input
                      type="number"
                      {...form.register("currentHp", { valueAsNumber: true })}
                      min={0}
                    />
                  </div>
                  <div className="space-y-4">
                    <Label>Damage Calculator</Label>

                    <Input
                      type="number"
                      min={0}
                      value={incomingDamage}
                      onChange={(e) =>
                        setIncomingDamage(Number(e.target.value))
                      }
                      placeholder="Incoming Damage"
                    />
                    <Button className="w-34" type="button" onClick={handleDamageCalculation}>
                      Calculate Damage
                    </Button>

                    <Checkbox
                      className="ml-4"
                      checked={form.watch("shieldonoff")}
                      onCheckedChange={(checked) =>
                        form.setValue("shieldonoff", !!checked)
                      }
                    ></Checkbox>
                    <Label className="ml-2">Shield On/Off</Label>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleExportCharacter}
                  className="flex gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export Character
                </Button>
                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportCharacter}
                    className="hidden"
                    id="import-character"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("import-character")?.click()}
                    className="flex gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Import Character
                  </Button>
                </div>
              </div>         
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
