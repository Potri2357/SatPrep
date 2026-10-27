/**
 * Direct Gemini AI Integration Service (REST API)
 * Seamlessly works on Vercel Edge/Serverless and local Node.js without requiring external Python runtime.
 */

export interface GeneratedQuestionPayload {
  stem: string;
  options: { id: string; text: string }[];
  correct_option: string;
  solution: string;
  shortcut?: string;
  option_rationales?: Record<string, string>;
  difficulty: number;
  topic_id: string;
}

export async function checkGeminiConnection(): Promise<{
  success: boolean;
  model?: string;
  message?: string;
  error?: string;
}> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your-gemini-api-key-here') {
    return {
      success: false,
      error: 'GEMINI_API_KEY is not configured in environment variables.',
    };
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      { cache: 'no-store' }
    );

    if (!res.ok) {
      const errText = await res.text();
      return {
        success: false,
        error: `Gemini API returned status ${res.status}: ${errText.substring(0, 150)}`,
      };
    }

    const data = await res.json();
    const models: any[] = data.models || [];
    const hasFlash = models.find((m) => m.name.includes('gemini-2.5-flash') || m.name.includes('gemini-1.5-flash'));
    const modelName = hasFlash ? hasFlash.displayName || hasFlash.name : models[0]?.displayName || 'Gemini Flash';

    return {
      success: true,
      model: modelName,
      message: `Successfully connected to Google Gemini API (${modelName}).`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Failed to connect to Google Generative Language endpoint.',
    };
  }
}

export async function generateBankingQuestionWithGemini(
  topicId: string,
  topicName: string,
  difficulty: number = 3
): Promise<GeneratedQuestionPayload | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const prompt = `You are a Quantitative Aptitude psychometrician for Indian Bank Exams (IBPS PO, SBI PO Prelims).
Generate 1 high-quality, calibrated question on the topic "${topicName}".
Target Difficulty: Level ${difficulty} out of 5 (1 = Easy, 2 = Moderate-Easy, 3 = Moderate, 4 = Hard, 5 = Mains Level).

Rules:
1. Provide a realistic question stem using KaTeX formatting ($...$ for math expressions).
2. Exactly 5 options (id: "a", "b", "c", "d", "e").
3. Exactly ONE option must be correct.
4. Provide a step-by-step mathematical solution.
5. Provide a 20-second Vedic math/speed shortcut.
6. Provide specific student miscalculation traps for why they might mistakenly pick each distractor.
7. CRITICAL: Any LaTeX backslash MUST be properly escaped with double backslashes (e.g. \\\\sqrt, \\\\frac, \\\\times) to produce strictly valid JSON.

Respond with strict JSON adhering to this exact schema (no markdown formatting outside of JSON):
{
  "stem": "In the following question...",
  "options": [
    {"id": "a", "text": "240"},
    {"id": "b", "text": "280"},
    {"id": "c", "text": "320"},
    {"id": "d", "text": "360"},
    {"id": "e", "text": "None of these"}
  ],
  "correct_option": "c",
  "solution": "Step by step calculation...",
  "shortcut": "Fast mental shortcut...",
  "option_rationales": {
    "a": "Common arithmetic addition error...",
    "b": "Forgot to subtract remainder...",
    "c": "Correct option",
    "d": "Multiplied instead of dividing...",
    "e": "Aspirant gave up prematurely"
  }
}`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!res.ok) {
      console.error('Gemini generate request failed:', await res.text());
      return null;
    }

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    const cleanedJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    let parsed: any;
    try {
      parsed = JSON.parse(cleanedJson);
    } catch {
      // Auto-escape bare backslashes for valid JSON parsing
      const fixed = cleanedJson.replace(/\\(?!["\\/bfnrtu]|u[0-9a-fA-F]{4})/g, '\\\\');
      parsed = JSON.parse(fixed);
    }

    return {
      stem: parsed.stem,
      options: parsed.options,
      correct_option: parsed.correct_option,
      solution: parsed.solution,
      shortcut: parsed.shortcut,
      option_rationales: parsed.option_rationales,
      difficulty,
      topic_id: topicId,
    };
  } catch (err) {
    console.error('Gemini generation error:', err);
    return null;
  }
}
