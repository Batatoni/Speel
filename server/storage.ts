import { characters, type Character, type InsertCharacter, type ProficiencyLevel } from "@shared/schema";
import fs from "fs";
import path from "path";

export interface IStorage {
  getCharacters(): Promise<Character[]>;
  getCharacter(id: number): Promise<Character | undefined>;
  createCharacter(character: InsertCharacter): Promise<Character>;
  updateCharacter(id: number, character: InsertCharacter): Promise<Character>;
  deleteCharacter(id: number): Promise<void>;
}

export class FileStorage implements IStorage {
  private filePath: string;
  private characters: Map<number, Character>;
  private currentId: number;

  constructor() {
    this.filePath = path.join(process.cwd(), "characters.json");
    this.characters = new Map();
    this.currentId = 1;
    this.loadFromFile();
  }

  private loadFromFile() {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, "utf-8");
        const characters = JSON.parse(data);
        this.characters = new Map(characters.map((char: Character) => [char.id, char]));
        this.currentId = Math.max(...Array.from(this.characters.keys()), 0) + 1;
      }
    } catch (error) {
      console.error("Error loading characters:", error);
    }
  }

  private saveToFile() {
    try {
      const data = JSON.stringify(Array.from(this.characters.values()), null, 2);
      fs.writeFileSync(this.filePath, data, "utf-8");
    } catch (error) {
      console.error("Error saving characters:", error);
    }
  }


  async getCharacters(): Promise<Character[]> {
    return Array.from(this.characters.values());
  }

  async getCharacter(id: number): Promise<Character | undefined> {
    return this.characters.get(id);
  }

  async createCharacter(insertCharacter: InsertCharacter): Promise<Character> {
    const id = this.currentId++;
    const character = this.convertToCharacter({ ...insertCharacter, id });
    this.characters.set(id, character);
    return character;
  }

  async updateCharacter(
    id: number,
    insertCharacter: InsertCharacter
  ): Promise<Character> {
    const character = this.convertToCharacter({ ...insertCharacter, id });
    this.characters.set(id, character);
    return character;
  }

  async deleteCharacter(id: number): Promise<void> {
    this.characters.delete(id);
    this.saveToFile();
  }

  private convertToCharacter(insertCharacter: InsertCharacter & { id: number }): Character {
    return {
      ...insertCharacter,
      strength: insertCharacter.strength as ProficiencyLevel,
      agility: insertCharacter.agility as ProficiencyLevel,
      endurance: insertCharacter.endurance as ProficiencyLevel,
      intelligence: insertCharacter.intelligence as ProficiencyLevel,
      wisdom: insertCharacter.wisdom as ProficiencyLevel,
      charisma: insertCharacter.charisma as ProficiencyLevel,
      willpower: insertCharacter.willpower as ProficiencyLevel,
      intuition: insertCharacter.intuition as ProficiencyLevel,
      presence: insertCharacter.presence as ProficiencyLevel,
    };
  }
}

export const storage = new FileStorage();
