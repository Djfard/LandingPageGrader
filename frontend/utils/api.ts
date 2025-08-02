export interface AnalyzeRequest {
  url?: string;
  raw_text?: string;
}

export interface AnalyzeResponse {
  what_it_is: string;
  who_it_is_for: string;
  value_prop: string;
  scores: {
    clarity: number;
    focus: number;
    differentiation: number;
    cta_strength: number;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function analyzeContent(data: AnalyzeRequest): Promise<AnalyzeResponse> {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Analysis failed: ${response.statusText}`);
  }

  return response.json();
}