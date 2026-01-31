import { NextRequest, NextResponse } from 'next/server';
import { mastra, formatUserContext, extractFormStructure, FORM_BUILDER_USER_CONTEXT_TEMPLATE } from '@/agents';

/**
 * POST /api/chat
 * Chat with the form builder agent
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, userContext } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Messages array is required',
        },
        { status: 400 }
      );
    }

    // Get the form builder agent
    const formBuilder = mastra.getAgent('formBuilder');

    // Build conversation string
    let conversationText = messages.map(m => `${m.role}: ${m.content}`).join('\n\n');
    
    if (userContext) {
      const contextStr = formatUserContext(userContext, FORM_BUILDER_USER_CONTEXT_TEMPLATE);
      conversationText = contextStr + '\n\n' + conversationText;
    }

    // Chat with the agent
    const result = await formBuilder.generate(conversationText);
    const response = result.text || '';

    // Try to extract form structure if agent is ready
    const formStructure = extractFormStructure(response);

    return NextResponse.json({
      success: true,
      response,
      formStructure,
    });
  } catch (error) {
    console.error('Error in chat:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process chat',
      },
      { status: 500 }
    );
  }
}
