import { GoogleGenAI } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateJobDescription = async (title: string, skills: string): Promise<string> => {
  try {
    const prompt = `
      Write a professional and engaging job description for a "${title}" position.
      Key required skills: ${skills}.
      
      Structure:
      1. Role Overview (2-3 sentences)
      2. Key Responsibilities (bullet points)
      3. Requirements (bullet points)
      
      Output Format: Markdown.
      Keep the tone professional yet inviting.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Failed to generate description.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating content. Please check your API key.";
  }
};

export const generateCoverLetter = async (jobTitle: string, company: string, candidateSkills: string): Promise<string> => {
  try {
    const prompt = `
      Write a persuasive and professional cover letter for a candidate applying for the position of "${jobTitle}" at "${company}".
      The candidate possesses the following skills/experience: ${candidateSkills}.
      
      The letter should be concise (under 250 words), express enthusiasm, and highlight why they are a good match.
      Do not include placeholders like "[Your Name]" - instead use generic placeholders or leave blank space if necessary, but try to make it ready to copy-paste with minor edits.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Failed to generate cover letter.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating content. Please check your API key.";
  }
};
