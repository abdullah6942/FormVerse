import { NextRequest, NextResponse } from 'next/server';
import { mastra } from '@/agents';

/**
 * POST /api/research
 * Conduct research based on form submission using Mastra Workflow
 * Implements agentic loop: Plan → Execute → Reflect → Terminate
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formData, userContext } = body;

    if (!formData || typeof formData !== 'object') {
      return NextResponse.json(
        {
          success: false,
          error: 'Form data is required',
        },
        { status: 400 }
      );
    }

    // Get the research workflow
    const workflow = mastra.getWorkflow('researchWorkflow');

    // Execute workflow with agentic loop
    const run = await workflow.createRun();
    const result = await run.start({
      inputData: {
        formData,
        userContext,
      },
    });

    // Check workflow execution status
    if (result.status === 'failed') {
      console.error('Workflow failed:', result.error);
      return NextResponse.json(
        {
          success: false,
          error: 'Research workflow failed',
        },
        { status: 500 }
      );
    }

    if (result.status !== 'success') {
      return NextResponse.json(
        {
          success: false,
          error: `Unexpected workflow status: ${result.status}`,
        },
        { status: 500 }
      );
    }

    // Extract workflow results
    const { report, qualityScore, recommendations } = result.result;

    // For backward compatibility, format as expected by frontend
    const findings = report || '';
    const sources: Array<{ title: string; url: string; snippet: string }> = [];
    
    // Add quality and recommendations as sources
    recommendations.forEach((rec, idx) => {
      sources.push({
        title: `Recommendation ${idx + 1}`,
        url: '#',
        snippet: rec,
      });
    });

    return NextResponse.json({
      success: true,
      result: {
        findings,
        sources,
        qualityScore,
        recommendations,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error in research:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to conduct research',
      },
      { status: 500 }
    );
  }
}
