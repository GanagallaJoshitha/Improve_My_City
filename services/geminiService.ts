import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// We'll create the client just-in-time for API calls to ensure it uses the latest key if it changes.
const getAIClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        // This will be caught and handled gracefully in the UI.
        throw new Error("The environment variable API_KEY is not set.");
    }
    return new GoogleGenAI({ apiKey });
};

/**
 * Sends a text message to the Gemini API chatbot.
 * @param message The user's message.
 * @returns The bot's text response.
 */
export const sendChatMessage = async (message: string): Promise<string> => {
  try {
    const ai = getAIClient();
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: "You are a helpful assistant for a civic issue tracking application. You can answer questions about local issues, reporting procedures, and the status of complaints. Be concise and friendly.",
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error sending chat message to Gemini:", error);
    throw new Error("Sorry, I'm having trouble connecting. Please try again later.");
  }
};

/**
 * Generates a video from a text prompt using the Veo model.
 * @param prompt The text prompt for the video.
 * @returns A URL to the generated video file.
 */
export const generateVideoFromPrompt = async (prompt: string): Promise<string> => {
    const ai = getAIClient();
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      throw new Error("The environment variable API_KEY is not set.");
    }

    // Video generation can take a few minutes.
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });
  
    // Poll for the result.
    while (!operation.done) {
      // Wait for 10 seconds before polling again, as recommended.
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation });
    }
  
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

    if (downloadLink) {
      // Per the docs, the API key must be appended to the download URI.
      return `${downloadLink}&key=${apiKey}`;
    }
    
    throw new Error("Video generation failed or returned no download link.");
};
