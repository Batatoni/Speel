import { characters, type Character, type InsertCharacter } from "@shared/schema";

export interface IStorage {
  getCharacters(): Promise<Character[]>;
  getCharacter(id: number): Promise<Character | undefined>;
  createCharacter(character: InsertCharacter): Promise<Character>;
  updateCharacter(id: number, character: InsertCharacter): Promise<Character>;
  deleteCharacter(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private characters: Map<number, Character>;
  private currentId: number;

  constructor() {
    this.characters = new Map();
    this.currentId = 1;
  }

  async getCharacters(): Promise<Character[]> {
    return Array.from(this.characters.values());
  }

  async getCharacter(id: number): Promise<Character | undefined> {
    return this.characters.get(id);
  }

  async createCharacter(insertCharacter: InsertCharacter): Promise<Character> {
    const id = this.currentId++;
    const character = { ...insertCharacter, id };
    this.characters.set(id, character);
    return character;
  }

  async updateCharacter(
    id: number,
    insertCharacter: InsertCharacter
  ): Promise<Character> {
    const character = { ...insertCharacter, id };
    this.characters.set(id, character);
    return character;
  }

  async deleteCharacter(id: number): Promise<void> {
    this.characters.delete(id);
  }
}

export const storage = new MemStorage();
