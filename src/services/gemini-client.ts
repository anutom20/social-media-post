import { GoogleGenAI, createUserContent } from "@google/genai";
import { GeneratedPost } from "@/types/interfaces";

// TODO: Ask user - Should we use a singleton pattern for the Gemini client?
// Or create new instances for each request?

interface ProcessedPostData {
  vendorImage: Buffer;
  logo: Buffer;
  tone: string;
  postText: string;
  brandColors: string[];
  // TODO: Ask user - Should we include image metadata like dimensions, format?
}

class GeminiService {
  private ai: GoogleGenAI;
  private textModel: string;
  private imageModel: string;

  constructor() {
    this.ai = new GoogleGenAI({});
    this.textModel = "gemini-2.5-flash";
    this.imageModel = "imagen-4.0-generate-001";
  }

  async generateImage(data: ProcessedPostData): Promise<string> {
    try {
      // Step 1: Analyze the images to get context
      const imageContext = await this.analyzeImages(data);

      // Step 2: Build prompt combining image context with brand requirements
      const imagePrompt = this.buildImageGenerationPrompt(data, imageContext);

      // Step 3: Generate image using Imagen
      const response = await this.ai.models.generateImages({
        model: this.imageModel,
        prompt: imagePrompt,
        config: {
          numberOfImages: 1,
        },
      });

      // Extract the generated image
      if (response.generatedImages && response.generatedImages.length > 0) {
        const generatedImage = response.generatedImages[0];
        const imgBytes = generatedImage.image.imageBytes;
        // Return as data URL
        return `data:image/png;base64,${imgBytes}`;
      }

      throw new Error("No image generated in response");
    } catch (error) {
      console.error("Error generating image:", error);
      throw new Error("Failed to generate image");
    }
  }

  async generateText(data: ProcessedPostData): Promise<string> {
    try {
      // Convert images to base64
      const vendorImageBase64 = data.vendorImage.toString("base64");
      const logoBase64 = data.logo.toString("base64");

      const prompt = this.buildTextPrompt(
        `Create engaging social media post text based on the following inputs and images:

        ORIGINAL POST CONTENT:
        "${data.postText}"

        BRAND REQUIREMENTS:
        - Tone of voice: ${data.tone}
        - Brand colors being used: ${data.brandColors.join(", ")}

        INSTRUCTIONS:
        - Analyze the two images provided (vendor image and logo) 
        - Create compelling, ready-to-post social media text that complements the images
        - Maintain a ${data.tone.toLowerCase()} tone throughout
        - Expand and enhance the original post content: "${data.postText}" into a comprehensive, engaging post
        - Make it a detailed post of 400-500 words for maximum engagement and storytelling
        - Structure it with multiple paragraphs for readability
        - Include a compelling hook in the first sentence
        - Add storytelling elements, behind-the-scenes insights, or personal anecdotes
        - Include relevant emojis throughout that fit the ${data.tone.toLowerCase()} tone
        - Add a call-to-action or engaging question to encourage comments
        - Add 8-12 relevant hashtags at the end organized by relevance
        - Make it authentic and conversational, not overly promotional
        - Ensure it's ready to copy-paste and post immediately on social media

        IMPORTANT: Return ONLY the final post text that users can directly copy and paste. Do not include any explanations, instructions, or meta-text like "Here's your post:" or "Copy this text:". Just provide the actual social media post content.`
      );

      const response = await this.ai.models.generateContent({
        model: this.textModel,
        contents: createUserContent([
          prompt,
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: vendorImageBase64,
            },
          },
          {
            inlineData: {
              mimeType: "image/png",
              data: logoBase64,
            },
          },
        ]),
      });
      console.log(`gemini text response = ${response.text}`);
      return response.text!;
    } catch (error) {
      console.error("Error generating text:", error);
      throw new Error("Failed to generate text");
    }
  }

  async analyzeImages(data: ProcessedPostData): Promise<string> {
    try {
      // Convert images to base64
      const vendorImageBase64 = data.vendorImage.toString("base64");
      const logoBase64 = data.logo.toString("base64");

      const prompt = this.buildTextPrompt(
        `Analyze these two images (vendor image and logo) and provide a detailed description:

         ANALYSIS REQUIREMENTS:
          - Describe the vendor image: What products, services, or scenes are shown?
          - Describe the logo: What brand elements, colors, style are present?
          - Identify key visual elements that should be incorporated into a social media post
          - Note any relevant colors, themes, or branding elements
          - Describe the overall mood and aesthetic of the images

        Provide a comprehensive description that can be used to create a branded social media post design.`
      );

      const response = await this.ai.models.generateContent({
        model: this.textModel,
        contents: createUserContent([
          prompt,
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: vendorImageBase64,
            },
          },
          {
            inlineData: {
              mimeType: "image/png",
              data: logoBase64,
            },
          },
        ]),
      });

      return response.text || "Unable to analyze images";
    } catch (error) {
      console.error("Error analyzing images:", error);
      return "Image analysis failed";
    }
  }

  buildImageGenerationPrompt(
    data: ProcessedPostData,
    imageContext: string
  ): string {
    return `Create a professional social media post design with these requirements:

            IMAGE CONTEXT:
            ${imageContext}

            BRAND REQUIREMENTS:
            - Tone: ${data.tone}
            - Brand colors: ${data.brandColors.join(", ")}
            - Post message: "${data.postText}"

            DESIGN INSTRUCTIONS:
            - Create a modern, engaging social media post layout
            - Incorporate elements from the vendor image as the main visual focus
            - Include the logo in a prominent but balanced way
            - Use the specified brand colors: ${data.brandColors.join(
              ", "
            )} throughout the design
            - Maintain a ${data.tone.toLowerCase()} aesthetic
            - Make it suitable for Instagram, Facebook, LinkedIn
            - Ensure text overlays are readable and well-positioned
            - Create a scroll-stopping, professional design that represents the brand

            The final result should be a complete social media post image that combines all these elements cohesively.`;
  }

  private buildImagePrompt(data: ProcessedPostData): string {
    return `Create a professional social media post image with these requirements:

            CONTENT & MESSAGING:
            - Post message: "${data.postText}"
            - Tone: ${data.tone}

            VISUAL ELEMENTS:
            - Incorporate the vendor image as the main focal point
            - Include the logo prominently but not overshadowing the main image
            - Use brand colors: ${data.brandColors.join(
              ", "
            )} as accent colors and backgrounds
            - Create a cohesive, branded social media post layout

            DESIGN STYLE:
            - Modern, clean social media post design
            - Professional layout suitable for platforms like Instagram, Facebook, LinkedIn
            - Ensure text is readable and well-positioned
            - Balance between the vendor image, logo, and brand colors
            - ${data.tone} aesthetic throughout the design

            Make it engaging and scroll-stopping while maintaining brand consistency.`;
  }

  private buildTextPrompt(promptText: string): string {
    return promptText;
  }
}

export async function generateSocialMediaPost(
  data: ProcessedPostData
): Promise<GeneratedPost> {
  const geminiService = new GeminiService();

  try {
    // Generate text and image in parallel since they use different approaches
    const [generatedImage, generatedText] = await Promise.all([
      geminiService.generateImage(data), // Uses two-step process internally
      geminiService.generateText(data),
    ]);

    return {
      image: generatedImage,
      text: generatedText,
    };
  } catch (error) {
    console.error("Error in generateSocialMediaPost:", error);
    throw error;
  }
}
