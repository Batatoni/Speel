import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  body: integer("body").notNull(),
  mind: integer("mind").notNull(),
  soul: integer("soul").notNull(),
  // Body Skills
  strength: integer("strength").notNull(),
  agility: integer("agility").notNull(),
  endurance: integer("endurance").notNull(),
  // Mind Skills
  intelligence: integer("intelligence").notNull(),
  wisdom: integer("wisdom").notNull(),
  charisma: integer("charisma").notNull(),
  // Soul Skills
  willpower: integer("willpower").notNull(),
  intuition: integer("intuition").notNull(),
  presence: integer("presence").notNull(),
  // HP
  currentHp: integer("currentHp").notNull(),
  maxHp: integer("maxHp").notNull(),
});

export const insertCharacterSchema = createInsertSchema(characters).omit({
  id: true,
});

export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type Character = typeof characters.$inferSelect;
