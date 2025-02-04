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

export default function CharacterSheet() {
  const { toast } = useToast();
  const form = useForm<InsertCharacter>({
    resolver: zodResolver(insertCharacterSchema),
    defaultValues: {
      name: "",
      body: 10,
      mind: 10,
      soul: 10,
      // Initialize all skills with 'none' level
      strength: "none",
      agility: "none",
      endurance: "none",
      intelligence: "none",
      wisdom: "none",
      charisma: "none",
      willpower: "none",
      intuition: "none",
      presence: "none",
      currentHp: 50,
      maxHp: 50,
    },
  });

  const { data: characters } = useQuery({
    queryKey: ["/api/characters"],
  });

  const { mutate: saveCharacter, isPending } = useMutation({
    mutationFn: async (data: InsertCharacter) => {
      await apiRequest("POST", "/api/characters", data);
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
                <AttributeInput form={form} name="body" label="Body" />
                <AttributeInput form={form} name="mind" label="Mind" />
                <AttributeInput form={form} name="soul" label="Soul" />
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <SkillInput
                    form={form}
                    name="strength"
                    label="Strength"
                    attributeValue={watchBody}
                  />
                  <SkillInput
                    form={form}
                    name="agility"
                    label="Agility"
                    attributeValue={watchBody}
                  />
                  <SkillInput
                    form={form}
                    name="endurance"
                    label="Endurance"
                    attributeValue={watchBody}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <SkillInput
                    form={form}
                    name="intelligence"
                    label="Intelligence"
                    attributeValue={form.watch("mind")}
                  />
                  <SkillInput
                    form={form}
                    name="wisdom"
                    label="Wisdom"
                    attributeValue={form.watch("mind")}
                  />
                  <SkillInput
                    form={form}
                    name="charisma"
                    label="Charisma"
                    attributeValue={form.watch("mind")}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <SkillInput
                    form={form}
                    name="willpower"
                    label="Willpower"
                    attributeValue={form.watch("soul")}
                  />
                  <SkillInput
                    form={form}
                    name="intuition"
                    label="Intuition"
                    attributeValue={form.watch("soul")}
                  />
                  <SkillInput
                    form={form}
                    name="presence"
                    label="Presence"
                    attributeValue={form.watch("soul")}
                  />
                </div>
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