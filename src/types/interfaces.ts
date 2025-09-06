export interface PostInputs {
  vendorImage: File | null;
  logo: File | null;
  tone: string;
  postText: string;
  brandColors: string[];
}

export interface GeneratedPost {
  image: string;
  text: string;
}

export interface GeneratePostResponse {
  success: boolean;
  data?: GeneratedPost;
  error?: string;
}

export interface UploadFormProps {
  onSubmit: (inputs: PostInputs) => void;
  isLoading: boolean;
}

export interface ResultsDisplayProps {
  result: GeneratedPost | null;
  isLoading: boolean;
}

export const TONE_OPTIONS = [
  'Professional',
  'Casual',
  'Friendly',
  'Energetic',
  'Luxury',
  'Fun',
  'Informative'
] as const;

export type ToneType = typeof TONE_OPTIONS[number];