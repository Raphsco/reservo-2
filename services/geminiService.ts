import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { MOCK_PROVIDERS } from '../constants';

let chatSession: Chat | null = null;

const SYSTEM_INSTRUCTION = `
You are 'Reservo Bot', an intelligent assistant for the Reservo booking application. 
Your goal is to help users find services, answer questions about bookings, and explain app features.
You have access to the following current providers in the database:
${JSON.stringify(MOCK_PROVIDERS.map(p => ({name: p.name, category: p.category, services: p.services.map(s => s.name)})))}

- Be concise, friendly, and helpful.
- If a user asks for a recommendation, suggest a provider from the list.
- If asked about loyalty, explain the universal wallet feature.
- Use emojis sparingly but effectively.
`;

export const getGeminiChat = (): Chat => {
  if (!process.env.API_KEY) {
      console.warn("API_KEY is missing. Mocking chat for demo purposes.");
      // In a real scenario, we would throw error, but for this demo UI we handle it gracefully in the component
  }

  if (!chatSession && process.env.API_KEY) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  }
  return chatSession as Chat;
};

export const sendMessageToGemini = async (message: string): Promise<AsyncIterable<GenerateContentResponse>> => {
  const chat = getGeminiChat();
  if (!chat) {
      // Mock generator if no API key
      async function* mockGenerator() {
          await new Promise(r => setTimeout(r, 500));
          yield { text: "Je suis désolé, je n'ai pas accès à ma clé API pour le moment. Veuillez vérifier la configuration." } as any;
      }
      return mockGenerator();
  }
  
  return await chat.sendMessageStream({ message });
};
