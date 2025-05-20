export interface ErrorResponse {
  error: string;
}

export interface Measurements {
  bust: number;
  waist: number;
  hips: number;
}

export interface AnalysisResult {
  type: string;
  advice: string;
} 