import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCharacterSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  app.get("/api/characters", async (_req, res) => {
    const characters = await storage.getCharacters();
    res.json(characters);
  });

  app.get("/api/characters/:id", async (req, res) => {
    const character = await storage.getCharacter(Number(req.params.id));
    if (!character) {
      return res.status(404).json({ message: "Character not found" });
    }
    res.json(character);
  });

  app.post("/api/characters", async (req, res) => {
    const parsed = insertCharacterSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid character data" });
    }
    const character = await storage.createCharacter(parsed.data);
    res.json(character);
  });

  app.put("/api/characters/:id", async (req, res) => {
    const parsed = insertCharacterSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid character data" });
    }
    const character = await storage.updateCharacter(
      Number(req.params.id),
      parsed.data
    );
    res.json(character);
  });

  app.delete("/api/characters/:id", async (req, res) => {
    await storage.deleteCharacter(Number(req.params.id));
    res.status(204).end();
  });

  return createServer(app);
}
