import { NextRequest, NextResponse } from 'next/server';
import { globalStore, INITIAL_TOPICS } from '@/lib/store';
import { generateBankingQuestionWithCascade } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { topic_id, difficulty, count, method, preferred_model } = await req.json();
    const topicObj = INITIAL_TOPICS.find((t) => t.id === topic_id);
    const topicName = topicObj ? topicObj.name : 'Quantitative Aptitude';

    let generatedQuestion = null;
    let telemetry = null;
    let actualMethod = method || 'template';

    if (method === 'llm_twist') {
      const cascadeResult = await generateBankingQuestionWithCascade(
        topic_id,
        topicName,
        difficulty || 3,
        preferred_model
      );

      if (cascadeResult) {
        generatedQuestion = cascadeResult.question;
        telemetry = cascadeResult.telemetry;

        const qId = `q-ai-${Date.now()}`;
        globalStore.addQuestion(
          {
            id: qId,
            topic_id,
            type: 'mcq',
            difficulty_assigned: difficulty || 3,
            status: 'live',
            source: 'ai_twist',
            version: 1,
            stem: generatedQuestion.stem,
            options: generatedQuestion.options,
          },
          {
            question_id: qId,
            correct_option: generatedQuestion.correct_option,
            solution: generatedQuestion.solution,
            shortcut: generatedQuestion.shortcut,
            option_rationales: generatedQuestion.option_rationales,
          }
        );
      }
    }

    const job = globalStore.createJob({
      topic_id,
      difficulty: difficulty || 3,
      count: count || (generatedQuestion ? 1 : 10),
      method: actualMethod,
    });

    return NextResponse.json({
      success: true,
      job,
      generated_question: generatedQuestion,
      telemetry,
      ai_powered: Boolean(generatedQuestion),
    });
  } catch (err: any) {
    console.error('Error in generation API:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
