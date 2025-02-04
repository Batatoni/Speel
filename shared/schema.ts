import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define proficiency levels as a string literal type since we're using in-memory storage
export type ProficiencyLevel = "x1" | "x2" | "x3" | "x4";

export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  body: integer("body").notNull(),
  mind: integer("mind").notNull(),
  soul: integer("soul").notNull(),
  // Body Skills
  strength: text("strength").notNull().$type<ProficiencyLevel>(),
  agility: text("agility").notNull().$type<ProficiencyLevel>(),
  endurance: text("endurance").notNull().$type<ProficiencyLevel>(),
  // Mind Skills
  intelligence: text("intelligence").notNull().$type<ProficiencyLevel>(),
  wisdom: text("wisdom").notNull().$type<ProficiencyLevel>(),
  charisma: text("charisma").notNull().$type<ProficiencyLevel>(),
  // Soul Skills
  willpower: text("willpower").notNull().$type<ProficiencyLevel>(),
  intuition: text("intuition").notNull().$type<ProficiencyLevel>(),
  presence: text("presence").notNull().$type<ProficiencyLevel>(),
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
  return Number(level.slice(1));
}