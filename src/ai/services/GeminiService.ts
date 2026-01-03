/**
 * GeminiService: Handles all communication with Google Gemini API
 * Provides circuit generation from natural language descriptions
 */

import {
  ComponentDefinition,
  GeminiAPIError,
  GeminiCircuitResponse,
} from '../../types';
import { GeminiPromptBuilder } from './GeminiPromptBuilder';

export interface ImageGenerationResult {
  success: boolean;
  imageData?: string; // Base64 PNG data (without data:image/png;base64, prefix)
  imageDataUrl?: string; // Full data URL for direct use
  description?: string; // AI's description of the generated image
  error?: GeminiAPIError;
}

export class GeminiService {
  private apiKey: string;
  private model: string;
  private imageModel: string;
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta/models';

  constructor(
    apiKey: string,
    model: string = 'gemini-1.5-flash',
    imageModel: string = 'gemini-2.5-flash-preview-0520'
  ) {
    this.apiKey = apiKey;
    this.model = model;
    this.imageModel = imageModel;
  }

  /**
   * Generate circuit from natural language description using Gemini AI
   */
  async generateCircuit(
    userPrompt: string,
    componentLibrary: ComponentDefinition[]
  ): Promise<GeminiCircuitResponse> {
    const systemPrompt = GeminiPromptBuilder.buildSystemPrompt(componentLibrary);
    const fullPrompt = GeminiPromptBuilder.buildUserPrompt(userPrompt);

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `${systemPrompt}\n\n${fullPrompt}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.3, // Lower temperature for more deterministic output
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json', // Request JSON response
      },
    };

    try {
      const response = await fetch(
        `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      // Handle HTTP errors
      if (!response.ok) {
        throw this.handleHttpError(response.status, await response.text());
      }

      const data = await response.json();

      // Extract the generated text from Gemini response
      const generatedText = this.extractGeneratedText(data);

      // Parse the JSON response
      return this.parseGeminiResponse(generatedText);
    } catch (error) {
      // Re-throw GeminiAPIError as-is
      if (this.isGeminiAPIError(error)) {
        throw error;
      }

      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw {
          type: 'NETWORK_ERROR',
          message: 'Unable to connect to AI service. Check your internet connection.',
          details: error.message,
        } as GeminiAPIError;
      }

      // Handle unknown errors
      throw {
        type: 'UNKNOWN',
        message: 'An unexpected error occurred while generating the circuit.',
        details: error instanceof Error ? error.message : String(error),
      } as GeminiAPIError;
    }
  }

  /**
   * Generate a circuit diagram image using Gemini 2.5 Flash Image model
   */
  async generateCircuitImage(circuitDescription: string): Promise<ImageGenerationResult> {
    const imagePrompt = `Generate a professional electrical circuit schematic diagram based on this description:

${circuitDescription}

Requirements:
- Use IEC 60617 standard electrical symbols
- Include proper component labels (QF1, KM1, F1, M1, etc.)
- Draw clean, professional lines on a white background
- Show POWER CIRCUIT section with: Supply lines (L1, L2, L3 or L, N), Circuit breaker (MCB), Contactor main contacts, Overload relay (OLR), Motor symbol
- Show CONTROL CIRCUIT section with: Control fuse, Stop button (NC), Start button (NO), Holding contact, Contactor coil (A1-A2)
- Include status indicators if applicable (RUN - green, TRIP - red)
- Make it suitable for professional documentation and PDF export
- Use black lines on white background for clarity
- Label all terminals and wire connections`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: imagePrompt,
            },
          ],
        },
      ],
      generationConfig: {
        responseModalities: ['IMAGE', 'TEXT'],
        responseMimeType: 'text/plain',
      },
    };

    try {
      const response = await fetch(
        `${this.baseUrl}/${this.imageModel}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: this.handleHttpError(response.status, errorText),
        };
      }

      const data = await response.json();

      // Extract image and text from response
      return this.extractImageFromResponse(data);
    } catch (error) {
      if (this.isGeminiAPIError(error)) {
        return {
          success: false,
          error: error as GeminiAPIError,
        };
      }

      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          error: {
            type: 'NETWORK_ERROR',
            message: 'Unable to connect to AI image service. Check your internet connection.',
            details: error.message,
          },
        };
      }

      return {
        success: false,
        error: {
          type: 'UNKNOWN',
          message: 'An unexpected error occurred while generating the circuit image.',
          details: error instanceof Error ? error.message : String(error),
        },
      };
    }
  }

  /**
   * Extract image data from Gemini 2.5 Flash Image response
   */
  private extractImageFromResponse(data: any): ImageGenerationResult {
    if (!data.candidates || data.candidates.length === 0) {
      return {
        success: false,
        error: {
          type: 'PARSE_ERROR',
          message: 'AI returned empty response for image generation.',
          details: 'No candidates in response',
        },
      };
    }

    const candidate = data.candidates[0];

    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      return {
        success: false,
        error: {
          type: 'PARSE_ERROR',
          message: 'AI returned invalid response format for image.',
          details: 'No content parts in candidate',
        },
      };
    }

    let imageData: string | undefined;
    let mimeType: string = 'image/png';
    let description: string | undefined;

    // Parse through parts to find image and text
    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        imageData = part.inlineData.data;
        mimeType = part.inlineData.mimeType || 'image/png';
      } else if (part.text) {
        description = part.text;
      }
    }

    if (!imageData) {
      return {
        success: false,
        error: {
          type: 'PARSE_ERROR',
          message: 'AI did not return an image. Try rephrasing your request.',
          details: 'No inlineData found in response parts',
        },
      };
    }

    return {
      success: true,
      imageData: imageData,
      imageDataUrl: `data:${mimeType};base64,${imageData}`,
      description: description,
    };
  }

  /**
   * Extract the generated text from Gemini API response
   */
  private extractGeneratedText(data: any): string {
    if (!data.candidates || data.candidates.length === 0) {
      throw {
        type: 'PARSE_ERROR',
        message: 'AI returned empty response. Please try again.',
        details: 'No candidates in response',
      } as GeminiAPIError;
    }

    const candidate = data.candidates[0];

    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      throw {
        type: 'PARSE_ERROR',
        message: 'AI returned invalid response format.',
        details: 'No content parts in candidate',
      } as GeminiAPIError;
    }

    return candidate.content.parts[0].text;
  }

  /**
   * Parse Gemini's text response into CircuitResponse structure
   */
  private parseGeminiResponse(responseText: string): GeminiCircuitResponse {
    // Clean the response - remove markdown code blocks if present
    let cleanJson = responseText.trim();

    // Remove markdown code fences
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.slice(7);
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.slice(3);
    }

    if (cleanJson.endsWith('```')) {
      cleanJson = cleanJson.slice(0, -3);
    }

    cleanJson = cleanJson.trim();

    try {
      const parsed = JSON.parse(cleanJson);

      // Validate required fields
      this.validateResponse(parsed);

      return parsed as GeminiCircuitResponse;
    } catch (parseError) {
      throw {
        type: 'PARSE_ERROR',
        message: 'AI returned invalid JSON. Please try rephrasing your request.',
        details: parseError instanceof Error ? parseError.message : 'JSON parse error',
      } as GeminiAPIError;
    }
  }

  /**
   * Validate the parsed response has required fields
   */
  private validateResponse(parsed: any): void {
    if (!parsed.description || typeof parsed.description !== 'string') {
      throw new Error('Missing or invalid "description" field');
    }

    if (!Array.isArray(parsed.components)) {
      throw new Error('Missing or invalid "components" array');
    }

    if (!Array.isArray(parsed.connections)) {
      throw new Error('Missing or invalid "connections" array');
    }

    // Validate each component has required fields
    for (const comp of parsed.components) {
      if (!comp.id || !comp.type || !comp.label) {
        throw new Error(`Invalid component: ${JSON.stringify(comp)}`);
      }
    }

    // Validate each connection has required fields
    for (const conn of parsed.connections) {
      if (!conn.from?.componentId || !conn.from?.pin || !conn.to?.componentId || !conn.to?.pin) {
        throw new Error(`Invalid connection: ${JSON.stringify(conn)}`);
      }
    }
  }

  /**
   * Handle HTTP error responses from Gemini API
   */
  private handleHttpError(status: number, responseText: string): GeminiAPIError {
    switch (status) {
      case 400:
        return {
          type: 'API_KEY_INVALID',
          message: 'Invalid request. Please check your API configuration.',
          details: responseText,
        };

      case 401:
      case 403:
        return {
          type: 'API_KEY_INVALID',
          message: 'Gemini API key is invalid or missing. Please check your .env file.',
          details: responseText,
        };

      case 429:
        return {
          type: 'RATE_LIMIT',
          message: 'Too many requests. Please wait a moment and try again.',
          details: responseText,
        };

      case 500:
      case 502:
      case 503:
        return {
          type: 'NETWORK_ERROR',
          message: 'AI service is temporarily unavailable. Please try again later.',
          details: responseText,
        };

      default:
        return {
          type: 'UNKNOWN',
          message: `API request failed with status ${status}`,
          details: responseText,
        };
    }
  }

  /**
   * Type guard for GeminiAPIError
   */
  private isGeminiAPIError(error: unknown): error is GeminiAPIError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'type' in error &&
      'message' in error
    );
  }
}
