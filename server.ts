import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "25mb" }));

  // Initialize Gemini AI client server-side safely
  const getGeminiAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({ apiKey });
  };

  // API Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      institution: "Gobierno Autónomo Descentralizado Municipal del Cantón Logroño",
      canton: "Logroño",
      provincia: "Morona Santiago",
      country: "Ecuador",
      timestamp: new Date().toISOString(),
    });
  });

  // Gemini AI Assistant Endpoint for Municipal Procedures & Incident Classification
  app.post("/api/assistant", async (req, res) => {
    try {
      const { prompt, context } = req.body;
      const ai = getGeminiAI();

      if (!ai) {
        // Fallback response if Gemini key is missing
        return res.json({
          reply: `[Modo Informativo LogroñoBot] Para realizar trámites en el GAD Municipal de Logroño (Morona Santiago), puede acercarse a la planta baja del Palacio Municipal en la Av. Miguel Tinoco o consultar el catálogo de trámites. Para la consulta "${prompt}", los requisitos habituales incluyen: Cédula de Ciudadanía, Certificado de No Adeudar y formulario oficial.`,
          source: "local-knowledge",
        });
      }

      const systemInstruction = `
Eres "LogroñoBot", el Asistente Virtual Oficial Inteligente del Gobierno Autónomo Descentralizado (GAD) Municipal del Cantón Logroño, Provincia de Morona Santiago, Ecuador.
Tu misión es orientar con cortesía, precisión y claridad a los ciudadanos de Logroño sobre:
1. Requisitos y pasos para trámites municipales (Patentes, Licencias, Certificados de no adeudar, Permisos de construcción, Agua potable y alcantarillado, Avalúos).
2. Reporte de incidencias urbanas y rurales (vialidad, agua potable, alumbrado público, recolección de basura, parques, emergencias).
3. Información sobre las parroquias y comunidades de Logroño (Logroño Centro, Yaupi, Shimpis) y horarios de atención municipal (Lunes a Viernes 08:00 - 17:00).
4. Asesorar respetando la normativa ecuatoriana (COOTAD, Ley de Comercio Electrónico).
Responde siempre en un tono institucional, amable, claro y estructurado en español.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });

      res.json({
        reply: response.text || "Disculpe, no pude generar una respuesta en este momento. Por favor intente de nuevo.",
        source: "gemini-2.5-flash",
      });
    } catch (error: any) {
      console.error("Error in Gemini assistant API:", error);
      res.status(500).json({
        error: "Error procesando la solicitud en el servidor municipal.",
        details: error?.message || "Unknown error",
      });
    }
  });

  // AI Smart Incident Categorizer Endpoint
  app.post("/api/classify-incident", async (req, res) => {
    try {
      const { description } = req.body;
      const ai = getGeminiAI();

      if (!ai || !description) {
        return res.json({
          category: "Otros",
          priority: "Media",
          suggestedTitle: "Reporte Ciudadano",
        });
      }

      const prompt = `Analiza la siguiente descripción de una incidencia reportada por un ciudadano en el Cantón Logroño (Ecuador):
"${description}"

Devuelve un objeto JSON con las siguientes claves:
- "category": Una de las siguientes categorías exactas: ["Alumbrado Público", "Agua Potable", "Alcantarillado", "Vialidad", "Basura", "Ambiente", "Parques", "Seguridad", "Emergencias", "Otros"]
- "priority": Una de: ["Baja", "Media", "Alta", "Urgente"]
- "suggestedTitle": Un título conciso e institucional de máximo 6 palabras.

Formato JSON estricto sin markdown ni comentarios.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      try {
        const parsed = JSON.parse(response.text || "{}");
        return res.json(parsed);
      } catch {
        return res.json({
          category: "Otros",
          priority: "Media",
          suggestedTitle: "Reporte Ciudadano Logroño",
        });
      }
    } catch (error) {
      console.error("Error classifying incident:", error);
      res.json({
        category: "Otros",
        priority: "Media",
        suggestedTitle: "Reporte Ciudadano Logroño",
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LOGROÑO CONECTA - Servidor GAD Municipal corriendo en http://0.0.0.0:${PORT}`);
  });
}

startServer();
