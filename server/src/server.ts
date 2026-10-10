import "dotenv/config"
import express from "express"
import cors from "cors";
import prisma from "./lib/prisma";
import { error } from "node:console";
import { create } from "node:domain";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req,res) => {
    res.json({message : "server started"});
});


app.post("/api/diary-pages", async (req, res) => {
  try {
    const { title, elements } = req.body;

    if (title !== undefined && typeof title !== "string") {
      res.status(400).json({ error: "Title must be a string." });
      return;
    }

    if (elements !== undefined && !Array.isArray(elements)) {
      res.status(400).json({ error: "Elements must be an array." });
      return;
    }

    const validTypes = ["TEXT", "IMAGE", "STICKER", "DRAWING"];

    if (elements?.some((element: any) =>
      !element ||
      !validTypes.includes(element.type) ||
      typeof element.x !== "number" ||
      typeof element.y !== "number" ||
      (element.content != null && typeof element.content !== "string")
    )) {
      res.status(400).json({ error: "One or more elements are invalid." });
      return;
    }

    const page = await prisma.diaryPage.create({
      data: {
        title: title?.trim() || "Untitled page",
        elements: {
          create: (elements ?? []).map((element: any, index: number) => ({
            type: element.type,
            x: element.x,
            y: element.y,
            width: element.width ?? 100,
            height: element.height ?? 100,
            rotation: element.rotation ?? 0,
            zIndex: element.zIndex ?? index,
            content: element.content ?? null,
          })),
        },
      },
      include: { elements: true },
    });

    res.status(201).json({ message: "Diary page saved!", page });
  } catch (error) {
    console.error("Failed to save diary page:", error);
    res.status(500).json({ error: "Failed to save diary page." });
  }
});


app.get("/api/diary-pages", async(_req,res) => {
    try {
        const pages = await prisma.diaryPage.findMany({
            orderBy: {createdAt : "desc"},
        });

        res.json({pages});
    } catch (error) {
        console.error("Failed to fetch diary pages:", error);
    res.status(500).json({ error: "Failed to fetch diary pages." });
    }
});

app.listen(PORT, ()=>{
      console.log(`Scrapbook Studio API running at http://localhost:${PORT}`);

})