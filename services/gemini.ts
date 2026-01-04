
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

export const cloneWebsite = async (
  prompt: string,
  imageUrl?: string
): Promise<{ code: string; analysis: string }> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const systemInstruction = `
    You are a world-class senior frontend engineer. Your task is to "clone" a website's UI/UX based on a user's description, URL, or screenshot.
    
    Rules:
    1. Generate ONLY valid, production-ready React code using Tailwind CSS.
    2. Use Lucide icons (assume they are available as components like <Search />, <User />, etc. but for this output use standard Lucide SVG paths or descriptive placeholders).
    3. The code must be a single self-contained component named 'ClonedWebsite'.
    4. Provide a detailed analysis of the design choices (typography, palette, layout) before the code.
    5. Ensure the design is responsive.
    
    Return the response in JSON format with two keys:
    - "analysis": A markdown string explaining the cloned design.
    - "code": The full React component code string.
  `;

  const contents: any[] = [{ text: `Clone this website: ${prompt}` }];
  
  if (imageUrl) {
    contents.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageUrl.split(',')[1]
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: imageUrl ? 'gemini-3-pro-image-preview' : 'gemini-3-pro-preview',
      contents: { parts: contents },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING },
            code: { type: Type.STRING }
          },
          required: ["analysis", "code"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      analysis: result.analysis || "No analysis provided.",
      code: result.code || "<div>Error generating code.</div>"
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
