
import { GoogleGenAI, Type } from "@google/genai";
import { Mood, Verse } from "../types";

// Note: process.env.API_KEY is handled externally.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMoodBasedScripture = async (mood: Mood): Promise<Verse> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The user is a teenager/young adult feeling ${mood}. Provide a relevant Bible verse (ESV or NIV) with a modern breakdown, "Real Talk" application for youth life (school, anxiety, social media), a daily action challenge, and a short 1-sentence prayer. Keep the tone authentic, not preachy.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reference: { type: Type.STRING },
            text: { type: Type.STRING },
            breakdown: { type: Type.STRING },
            realTalk: { type: Type.STRING },
            challenge: { type: Type.STRING },
            prayer: { type: Type.STRING },
          },
          required: ["reference", "text", "breakdown", "realTalk", "challenge", "prayer"]
        }
      }
    });

    if (!response.text) throw new Error("No response from spiritual guide.");
    return JSON.parse(response.text.trim()) as Verse;
  } catch (error) {
    console.error("BreadDaily Service Error:", error);
    throw error;
  }
};

export const moderateContent = async (text: string): Promise<{ safe: boolean; reason?: string }> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following text for a supportive youth Christian community app. 
      Text: "${text}"
      
      Rules:
      1. No hate speech, bullying, or explicit content.
      2. No spam or commercial promotion.
      3. Allow doubts, questions, and struggles if expressed respectfully.
      
      Return JSON: { "safe": boolean, "reason": string (optional, brief explanation if unsafe) }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            safe: { type: Type.BOOLEAN },
            reason: { type: Type.STRING },
          },
          required: ["safe"]
        }
      }
    });

    if (!response.text) return { safe: false, reason: "Unable to verify content." };
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Moderation Error:", error);
    // Default to safe if AI fails to keep the app usable, or handle as needed.
    return { safe: true };
  }
};
