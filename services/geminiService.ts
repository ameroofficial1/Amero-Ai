import { GoogleGenAI, Modality } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";

const fileToGenerativePart = (file: File) => {
  return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error('Failed to read file as data URL'));
      }
      const base64Data = reader.result.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const generateImageFromPhotos = async (childPhoto: File, adultPhoto: File): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const childImagePart = await fileToGenerativePart(childPhoto);
  const adultImagePart = await fileToGenerativePart(adultPhoto);

  const prompt = `Create an image that looks like a vintage 35mm film photograph from the 1990s, capturing an adult tenderly embracing their younger self. The style should be highly realistic but with the distinct aesthetic of analog film. Emphasize warm, nostalgic color tones, soft and natural lighting, and a subtle, fine film grain throughout the image. The composition should be intimate and emotionally resonant.

Use the two uploaded photos (childhood and adult) as a direct reference to perfectly blend the facial features, ensuring the subjects are clearly the same person at different ages. The final image must feel like an authentic, cherished memory captured on film, evoking a deep sense of nostalgia and self-connection.`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image-preview',
    contents: {
      parts: [
        childImagePart,
        adultImagePart,
        { text: prompt },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return part.inlineData.data;
    }
  }

  throw new Error("No image was generated. The model may have refused the request.");
};