import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCharacterSchema, type InsertCharacter } from "@shared/schema";
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
      currentHp: 50,
      maxHp: 50,
    },
  });

  const { data: characters } = useQuery({
    queryKey: ["/api/characters"],
  });

  const { mutate: saveCharacter, isPending } = useMutation({
    mutationFn: async (data: InsertCharacter) => {
      // Set all base values to the global skill base before saving
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
  const watchEndurance = form.watch("endurance");
  const maxHp = calculateMaxHp(watchBody, watchEndurance);

  form.setValue("maxHp", maxHp);

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

              <div className="grid grid-cols-3 gap-8">
                <div className="space-y-4">
                  <AttributeInput form={form} name="body" label="Body" />
                  <div className="pt-4 space-y-4">
                    <SkillInput
                      form={form}
                      name="strength"
                      label="Strength"
                      attributeValue={watchBody}
                      globalSkillBase={globalSkillBase}
                    />
                    <SkillInput
                      form={form}
                      name="agility"
                      label="Agility"
                      attributeValue={watchBody}
                      globalSkillBase={globalSkillBase}
                    />
                    <SkillInput
                      form={form}
                      name="endurance"
                      label="Endurance"
                      attributeValue={watchBody}
                      globalSkillBase={globalSkillBase}
                    />
                  </div>
                </div>
                <AttributeInput form={form} name="mind" label="Mind" />
                <AttributeInput form={form} name="soul" label="Soul" />
              </div>

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

              <div className="space-y-4">
                <Label>HP ({form.watch("currentHp")}/{maxHp})</Label>
                <Progress
                  value={(form.watch("currentHp") / maxHp) * 100}
                  className="h-4"
                />
                <Input
                  type="number"
                  {...form.register("currentHp", { valueAsNumber: true })}
                  min={0}
                  max={maxHp}
                />
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