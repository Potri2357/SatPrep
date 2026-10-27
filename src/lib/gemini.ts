/**
 * Multi-Model Resilient Gemini AI Integration Router
 * 
 * Features:
 * 1. Automatic Model Cascade Failover: gemini-2.5-flash -> gemini-3.5-flash-lite -> gemini-flash-lite-latest -> gemini-3.5-flash -> gemini-3-flash-preview
 * 2. Instant Quota/Rate-limit (429) & Overload (503) Recovery: Automatically switches models with 0 downtime
 * 3. Multi-Key Rotation: Supports comma-separated keys or GEMINI_API_KEY_BACKUP
 * 4. Model Health Telemetry & Cooldown: Tracks rate-limited models and temporarily cools them down
 * 5. Robust KaTeX / Math LaTeX JSON sanitizer: Prevents bad escape character crashes
 * 6. Edge & Serverless safe: 100% native REST fetch without heavy SDK bloat
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

export interface ModelTelemetry {
  model_used: string;
  attempts: number;
  models_tried: string[];
  latency_ms: number;
  failover_occurred: boolean;
}

export interface GenerationResponse {
  question: GeneratedQuestionPayload;
  telemetry: ModelTelemetry;
}

export interface ModelHealth {
  status: 'healthy' | 'cooldown' | 'error';
  successCount: number;
  failureCount: number;
  lastUsed?: string;
  cooldownUntil?: number;
  lastError?: string;
}

// Calibrated cascade order: fast, proven available models on Google API
export const DEFAULT_MODEL_CASCADE = [
  'gemini-2.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-3.5-flash',
  'gemini-3-flash-preview',
  'gemini-3.1-flash-lite',
];

// In-memory health tracker across serverless warm invocations
const modelHealthMap: Record<string, ModelHealth> = {};

function getModelHealth(model: string): ModelHealth {
  if (!modelHealthMap[model]) {
    modelHealthMap[model] = {
      status: 'healthy',
      successCount: 0,
      failureCount: 0,
    };
  }
  return modelHealthMap[model];
}

function parseApiKeys(): string[] {
  const primary = process.env.GEMINI_API_KEY || '';
  const backup = process.env.GEMINI_API_KEY_BACKUP || '';
  const rawList = `${primary},${backup}`
    .split(',')
    .map((k) => k.trim())
    .filter((k) => k.length > 5 && k !== 'your-gemini-api-key-here');
  return Array.from(new Set(rawList));
}

let currentKeyIndex = 0;
function getActiveApiKey(rotate = false): string | null {
  const keys = parseApiKeys();
  if (keys.length === 0) return null;
  if (rotate && keys.length > 1) {
    currentKeyIndex = (currentKeyIndex + 1) % keys.length;
  }
  return keys[currentKeyIndex] || keys[0];
}

/**
 * Robust JSON parser that handles raw LaTeX backslashes commonly emitted by LLMs
 */
function parseJsonWithLatexSafe(rawText: string): any {
  const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    // Escape unescaped backslashes that are not standard JSON escape sequences
    const fixed = cleaned.replace(/\\(?!["\\/bfnrtu]|u[0-9a-fA-F]{4})/g, '\\\\');
    return JSON.parse(fixed);
  }
}

/**
 * Check connection status and cascade pool health
 */
export async function checkGeminiConnection(): Promise<{
  success: boolean;
  activeModel?: string;
  cascadePool: { model: string; status: string; successes: number; failures: number }[];
  keyCount: number;
  message?: string;
  error?: string;
}> {
  const apiKey = getActiveApiKey();
  if (!apiKey) {
    return {
      success: false,
      cascadePool: [],
      keyCount: 0,
      error: 'GEMINI_API_KEY is not configured in environment variables.',
    };
  }

  const poolStatus = DEFAULT_MODEL_CASCADE.map((m) => {
    const h = getModelHealth(m);
    const isCooling = h.cooldownUntil && Date.now() < h.cooldownUntil;
    return {
      model: m,
      status: isCooling ? 'cooldown' : h.status,
      successes: h.successCount,
      failures: h.failureCount,
    };
  });

  try {
    // Quick ping to models endpoint
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      { cache: 'no-store' }
    );

    if (!res.ok) {
      const errText = await res.text();
      return {
        success: false,
        cascadePool: poolStatus,
        keyCount: parseApiKeys().length,
        error: `Gemini API returned status ${res.status}: ${errText.substring(0, 150)}`,
      };
    }

    const data = await res.json();
    const available = (data.models || []).map((m: any) => m.name.replace('models/', ''));
    
    // Pick the first available model from our cascade
    const firstOperational = DEFAULT_MODEL_CASCADE.find((m) => available.includes(m)) || DEFAULT_MODEL_CASCADE[0];

    return {
      success: true,
      activeModel: firstOperational,
      cascadePool: poolStatus,
      keyCount: parseApiKeys().length,
      message: `Active multi-model router ready (${DEFAULT_MODEL_CASCADE.length} fallback models, ${parseApiKeys().length} API key(s)).`,
    };
  } catch (err: any) {
    return {
      success: false,
      cascadePool: poolStatus,
      keyCount: parseApiKeys().length,
      error: err.message || 'Failed to connect to Google Generative Language endpoint.',
    };
  }
}

/**
 * Generate a banking question with automatic cascade failover across multiple models
 */
export async function generateBankingQuestionWithCascade(
  topicId: string,
  topicName: string,
  difficulty: number = 3,
  preferredModel?: string
): Promise<GenerationResponse | null> {
  const keys = parseApiKeys();
  if (keys.length === 0) {
    console.error('[ModelRouter] No Gemini API keys configured.');
    return null;
  }

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

  // Build model execution queue: preferred model first, then the cascade
  let queue = [...DEFAULT_MODEL_CASCADE];
  if (preferredModel && queue.includes(preferredModel)) {
    queue = [preferredModel, ...queue.filter((m) => m !== preferredModel)];
  }

  // Filter out models currently in active cooldown (unless all are in cooldown)
  const now = Date.now();
  const eligibleQueue = queue.filter((m) => {
    const h = getModelHealth(m);
    return !h.cooldownUntil || h.cooldownUntil < now;
  });
  const executionOrder = eligibleQueue.length > 0 ? eligibleQueue : queue;

  const modelsTried: string[] = [];
  const startTime = Date.now();

  for (let i = 0; i < executionOrder.length; i++) {
    const model = executionOrder[i];
    modelsTried.push(model);
    const health = getModelHealth(model);
    const apiKey = getActiveApiKey();

    try {
      console.log(`[ModelRouter] Attempting generation via model '${model}' (Attempt ${i + 1}/${executionOrder.length})...`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second per-model timeout

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
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
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorText = await res.text();
        console.warn(`[ModelRouter] Model '${model}' returned HTTP ${res.status}: ${errorText.substring(0, 120)}`);

        // Check if rate limited / quota exhausted (429) or overloaded (503)
        if (res.status === 429 || res.status === 503) {
          health.status = 'cooldown';
          health.cooldownUntil = Date.now() + 60 * 1000; // 60s cooldown
          health.lastError = `HTTP ${res.status}: Quota/Demand Limit`;
          // Try rotating key for the next attempt if multiple keys exist
          getActiveApiKey(true);
        } else {
          health.status = 'error';
          health.lastError = `HTTP ${res.status}`;
        }
        health.failureCount++;

        // Failover: proceed to next model in cascade
        continue;
      }

      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        console.warn(`[ModelRouter] Model '${model}' returned empty text candidate. Failing over...`);
        health.failureCount++;
        continue;
      }

      const parsed = parseJsonWithLatexSafe(rawText);
      if (!parsed || !parsed.stem || !Array.isArray(parsed.options) || !parsed.correct_option) {
        console.warn(`[ModelRouter] Model '${model}' returned invalid schema. Failing over...`);
        health.failureCount++;
        continue;
      }

      // Success!
      health.status = 'healthy';
      health.successCount++;
      health.lastUsed = new Date().toISOString();
      delete health.cooldownUntil;

      const latency = Date.now() - startTime;
      console.log(`[ModelRouter] SUCCESS via model '${model}' in ${latency}ms after ${i + 1} attempt(s)!`);

      return {
        question: {
          stem: parsed.stem,
          options: parsed.options,
          correct_option: parsed.correct_option,
          solution: parsed.solution || 'Detailed calculation provided in question analysis.',
          shortcut: parsed.shortcut,
          option_rationales: parsed.option_rationales,
          difficulty,
          topic_id: topicId,
        },
        telemetry: {
          model_used: model,
          attempts: i + 1,
          models_tried: modelsTried,
          latency_ms: latency,
          failover_occurred: i > 0,
        },
      };
    } catch (err: any) {
      console.warn(`[ModelRouter] Exception calling model '${model}': ${err.message}. Failing over...`);
      health.failureCount++;
      health.lastError = err.message;
      continue;
    }
  }

  console.error(`[ModelRouter] All ${executionOrder.length} models in cascade exhausted. Failed models: ${modelsTried.join(', ')}`);
  return null;
}

// Backward-compatible alias
export async function generateBankingQuestionWithGemini(
  topicId: string,
  topicName: string,
  difficulty: number = 3
): Promise<GeneratedQuestionPayload | null> {
  const result = await generateBankingQuestionWithCascade(topicId, topicName, difficulty);
  return result ? result.question : null;
}
