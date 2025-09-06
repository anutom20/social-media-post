import { NextRequest, NextResponse } from "next/server";
import { generateSocialMediaPost } from "@/services/gemini-client";
import { processFormData } from "@/utils/file-processing";
import { GeneratePostResponse } from "@/types/interfaces";

export async function POST(request: NextRequest) {
  try {
    // Extract and validate form data
    const formData = await request.formData();

    // Process uploaded files and extract data
    const processedData = await processFormData(formData);

    // Generate social media post using Gemini
    const result = await generateSocialMediaPost(processedData);

    const response: GeneratePostResponse = {
      success: true,
      data: result,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error generating post:", error);

    const errorResponse: GeneratePostResponse = {
      success: false,
      error: "Failed to generate social media post",
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
