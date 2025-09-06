import { ProcessedPostData } from '@/services/gemini-client';

export async function processFormData(formData: FormData): Promise<ProcessedPostData> {
  try {
    // Extract files from FormData
    const vendorImageFile = formData.get('vendorImage') as File;
    const logoFile = formData.get('logo') as File;
    const tone = formData.get('tone') as string;
    const postText = formData.get('postText') as string;
    const brandColorsJson = formData.get('brandColors') as string;
    
    // Parse brand colors
    const brandColors = JSON.parse(brandColorsJson || '[]');
    
    // Convert files to buffers
    const vendorImage = await fileToBuffer(vendorImageFile);
    const logo = await fileToBuffer(logoFile);
    
    // TODO: Ask user - Should we resize/optimize images before sending to Gemini?
    // What dimensions should we target for optimal performance?
    
    return {
      vendorImage,
      logo,
      tone,
      postText,
      brandColors
    };
    
  } catch (error) {
    console.error('Error processing form data:', error);
    throw new Error('Invalid form data provided');
  }
}

async function fileToBuffer(file: File): Promise<Buffer> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error('Error converting file to buffer:', error);
    throw new Error(`Failed to process file: ${file.name}`);
  }
}