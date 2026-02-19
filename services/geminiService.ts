import {
    GoogleGenAI,
    Type
} from "@google/genai";
import {
    RawNewsItem
} from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({
    apiKey: process.env.API_KEY
});

const newsItemSchema = {
    type: Type.OBJECT,
    properties: {
        headline: {
            type: Type.STRING,
            description: "A compelling, concise headline for the stock market news.",
        },
        ticker: {
            type: Type.STRING,
            description: "The stock ticker symbol for the company in question (e.g., 'AAPL', 'GOOGL').",
        },
        summary: {
            type: Type.STRING,
            description: "A brief, one-sentence summary of the news article.",
        },
        sentiment: {
            type: Type.STRING,
            enum: ["Positive", "Negative", "Neutral"],
            description: "The overall market sentiment of the news.",
        },
        sentimentScore: {
            type: Type.NUMBER,
            description: "A confidence score for the sentiment, from 0.0 to 1.0.",
        },
        sourceUrl: {
            type: Type.STRING,
            description: "A fictional, but plausible, URL to a news source for the article.",
        },
        imagePrompt: {
            type: Type.STRING,
            description: "A creative, descriptive prompt for an AI image generator to create a visually striking, abstract image that represents the news story.",
        },
    },
    required: ["headline", "ticker", "summary", "sentiment", "sentimentScore", "sourceUrl", "imagePrompt"],
};

export async function fetchStockNews(count: number): Promise < RawNewsItem[] > {
    const prompt = `Generate ${count} recent, impactful, and fictional stock market news items for major technology and finance companies. The news should be engaging and sound plausible. For each item, provide a headline, the company's stock ticker, a one-sentence summary, the market sentiment (Positive, Negative, or Neutral), a sentiment confidence score (0.0 to 1.0), a plausible source URL, and a creative prompt for an AI to generate a relevant, artistic image.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: newsItemSchema,
                },
            },
        });

        const jsonText = response.text.trim();
        const newsData = JSON.parse(jsonText);

        if (!Array.isArray(newsData)) {
            throw new Error("Invalid data format received from API.");
        }
        return newsData as RawNewsItem[];

    } catch (error) {
        console.error("Error fetching stock news from Gemini:", error);
        throw new Error("Failed to fetch news data from the Gemini API.");
    }
}

export async function generateNewsImage(prompt: string): Promise < string > {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `${prompt}, cinematic, hyper-realistic, dramatic lighting, 8k`,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9', // Horizontal aspect ratio for card feed
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }
    } catch (error) {
        console.error("Error generating image with Gemini:", error);
        throw new Error("Failed to generate image from the Gemini API.");
    }
}