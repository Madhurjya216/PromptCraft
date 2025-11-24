import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Category, OptimizationResult } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the schema for the structured output we want
const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    optimizedPrompt: {
      type: Type.STRING,
      description: "The rewritten, optimized version of the user's prompt.",
    },
    analysisNotes: {
      type: Type.STRING,
      description: "A brief analysis of why the changes were made and how they help.",
    },
    rating: {
      type: Type.INTEGER,
      description: "A score from 1 to 5 indicating the quality of the original prompt.",
    },
    improvements: {
      type: Type.ARRAY,
      description: "A list of specific improvements made.",
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, description: "The category of improvement (e.g., 'Clarity', 'Context')." },
          description: { type: Type.STRING, description: "Details about the specific improvement." }
        },
        required: ["type", "description"]
      }
    }
  },
  required: ["optimizedPrompt", "analysisNotes", "improvements", "rating"]
};

export const optimizePrompt = async (
  originalPrompt: string,
  category: Category
): Promise<OptimizationResult> => {
  try {
    const systemInstruction = `
      You are a world-class Prompt Engineering Expert. Your goal is to take a user's prompt and rewrite it to be clearer, more specific, and more effective for Large Language Models.
      
      Category Context: ${category}
      
      Analyze the input prompt for:
      1. Ambiguity or vagueness.
      2. Lack of context or constraints.
      3. Missing output format specifications.
      
      Then, generate an optimized version that:
      - Assigns a persona (if applicable).
      - clearly defines the task.
      - Sets constraints and format.
      - Uses precise language.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: originalPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated from Gemini.");
    }

    const parsedData = JSON.parse(text);

    return {
      originalPrompt,
      category,
      optimizedPrompt: parsedData.optimizedPrompt,
      analysisNotes: parsedData.analysisNotes,
      improvements: parsedData.improvements,
      rating: parsedData.rating
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to optimize prompt. Please try again.");
  }
};