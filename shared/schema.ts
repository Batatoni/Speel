import { int } from "drizzle-orm/mysql-core";
import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define proficiency levels as a string literal type since we're using in-memory storage
export type ProficiencyLevel = "none" | "trained" | "mastered" | "supreme";

export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  rank: text("rank").notNull(),
  body: integer("body").notNull(),
  mind: integer("mind").notNull(),
  soul: integer("soul").notNull(),
  dicevalue: text("dicevalue").notNull(),
  // Body Skills
  strength: text("strength").notNull().$type<ProficiencyLevel>(),
  strengthBase: integer("strengthBase").notNull(),
  strengthBonus: integer("strengthBonus").notNull(),
  agility: text("agility").notNull().$type<ProficiencyLevel>(),
  agilityBase: integer("agilityBase").notNull(),
  agilityBonus: integer("agilityBonus").notNull(),
  endurance: text("endurance").notNull().$type<ProficiencyLevel>(),
  enduranceBase: integer("enduranceBase").notNull(),
  enduranceBonus: integer("enduranceBonus").notNull(),
  // Mind Skills
  intelligence: text("intelligence").notNull().$type<ProficiencyLevel>(),
  intelligenceBase: integer("intelligenceBase").notNull(),
  intelligenceBonus: integer("intelligenceBonus").notNull(),
  wisdom: text("wisdom").notNull().$type<ProficiencyLevel>(),
  wisdomBase: integer("wisdomBase").notNull(),
  wisdomBonus: integer("wisdomBonus").notNull(),
  charisma: text("charisma").notNull().$type<ProficiencyLevel>(),
  charismaBase: integer("charismaBase").notNull(),
  charismaBonus: integer("charismaBonus").notNull(),
  // Soul Skills
  willpower: text("willpower").notNull().$type<ProficiencyLevel>(),
  willpowerBase: integer("willpowerBase").notNull(),
  willpowerBonus: integer("willpowerBonus").notNull(),
  intuition: text("intuition").notNull().$type<ProficiencyLevel>(),
  intuitionBase: integer("intuitionBase").notNull(),
  intuitionBonus: integer("intuitionBonus").notNull(),
  presence: text("presence").notNull().$type<ProficiencyLevel>(),
  presenceBase: integer("presenceBase").notNull(),
  presenceBonus: integer("presenceBonus").notNull(),
  // Equipment
  armorName: text("armorName").notNull(),
  armorValue: integer("armorValue").notNull(),
  shieldName: text("shieldName").notNull(),
  shieldValue: integer("shieldValue").notNull(),
  shieldonoff: boolean("shieldonoff").notNull(),
  weaponName: text("weaponName").notNull(),
  weaponDamage: integer("weaponDamage").notNull(),
  // HP
  currentHp: integer("currentHp").notNull(),
  maxHp: integer("maxHp").notNull(),
});

export const insertCharacterSchema = createInsertSchema(characters).omit({
  id: true,
});

export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type Character = typeof characters.$inferSelect;

// Helper functions
export function getProficiencyMultiplier(level: ProficiencyLevel): number {
  switch (level) {
    case "none":
      return 1;
    case "trained":
      return 2;
    case "mastered":
      return 3;
    case "supreme":
      return 4;
  }
}

export function calculateDamageReduction(
  incomingDamage: number,
  armorValue: number,
  enduranceBonus: number
): number {
  const totalArmor = armorValue + Math.floor(enduranceBonus / 2);
  if (incomingDamage == 0) return 0;
  else {
    // If armor is >= 50% of damage, use the complex formula
    if (totalArmor >= incomingDamage / 2) {
      return incomingDamage * (incomingDamage / (totalArmor * 3));
    }

    // Otherwise use basic reduction
    return Math.max(0, incomingDamage - totalArmor);
  }
}
