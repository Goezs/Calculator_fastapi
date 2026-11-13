import { ApiErrorResponse, CalculateRequest, CalculateResponse } from '../types/calculator';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1/calculator';

export class CalculatorApiError extends Error {
  public readonly error: string;
  public readonly timestamp: string;
  public readonly status: number;

  constructor(apiError: ApiErrorResponse, status: number = 400) {
    super(apiError.message);
    this.name = 'CalculatorApiError';
    this.error = apiError.error || 'BAD_REQUEST';
    this.timestamp = apiError.timestamp || new Date().toISOString();
    this.status = status;
  }
}

export const calculatorApi = {
  /**
   * Executes calculation request against FastAPI backend.
   * Gracefully extracts structured ApiErrorResponse on 400 Bad Request.
   */
  async calculate(payload: CalculateRequest): Promise<CalculateResponse> {
    let response: Response;
    try {
      response = await fetch(`${BASE_URL}/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch {
      throw new CalculatorApiError(
        {
          error: 'NETWORK_ERROR',
          message: 'Unable to reach backend API. Ensure FastAPI server is running on http://localhost:8000',
          timestamp: new Date().toISOString(),
        },
        0
      );
    }

    if (!response.ok) {
      let errorData: ApiErrorResponse;
      try {
        errorData = await response.json();
      } catch {
        errorData = {
          error: 'RESPONSE_PARSE_ERROR',
          message: `HTTP error ${response.status}: ${response.statusText}`,
          timestamp: new Date().toISOString(),
        };
      }

      throw new CalculatorApiError(errorData, response.status);
    }

    return response.json();
  },
};
