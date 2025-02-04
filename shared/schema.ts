import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define proficiency levels as a string literal type since we're using in-memory storage
export type ProficiencyLevel = "none" | "trained" | "mastered" | "supreme";

export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  body: integer("body").notNull(),
  mind: integer("mind").notNull(),
  soul: integer("soul").notNull(),
  // Body Skills
  strength: text("strength").notNull().$type<ProficiencyLevel>(),
  strengthBase: integer("strengthBase").notNull(),
  agility: text("agility").notNull().$type<ProficiencyLevel>(),
  agilityBase: integer("agilityBase").notNull(),
  endurance: text("endurance").notNull().$type<ProficiencyLevel>(),
  enduranceBase: integer("enduranceBase").notNull(),
  // Mind Skills
  intelligence: text("intelligence").notNull().$type<ProficiencyLevel>(),
  intelligenceBase: integer("intelligenceBase").notNull(),
  wisdom: text("wisdom").notNull().$type<ProficiencyLevel>(),
  wisdomBase: integer("wisdomBase").notNull(),
  charisma: text("charisma").notNull().$type<ProficiencyLevel>(),
  charismaBase: integer("charismaBase").notNull(),
  // Soul Skills
  willpower: text("willpower").notNull().$type<ProficiencyLevel>(),
  willpowerBase: integer("willpowerBase").notNull(),
  intuition: text("intuition").notNull().$type<ProficiencyLevel>(),
  intuitionBase: integer("intuitionBase").notNull(),
  presence: text("presence").notNull().$type<ProficiencyLevel>(),
  presenceBase: integer("presenceBase").notNull(),
  // HP
  currentHp: integer("currentHp").notNull(),
  maxHp: integer("maxHp").notNull(),
});

export const insertCharacterSchema = createInsertSchema(characters).omit({
  id: true,
});

export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type Character = typeof characters.$inferSelect;

// Helper function to get multiplier from proficiency level
export function getProficiencyMultiplier(level: ProficiencyLevel): number {
  switch (level) {
    case "none": return 1;
    case "trained": return 2;
    case "mastered": return 3;
    case "supreme": return 4;
  }
}