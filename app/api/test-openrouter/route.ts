import { NextResponse } from 'next/server';

// API Key for testing
const OPENROUTER_API_KEY = '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';
const SITE_URL = 'https://researchpaper-ai.vercel.app';
const SITE_NAME = 'ResearchPaperAI';

export async function GET() {
  try {
    // Make a simple models request to check authentication
    const modelsResponse = await fetch("https://openrouter.ai/api/v1/models", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    if (!modelsResponse.ok) {
      const errorData = await modelsResponse.json();
      console.error('OpenRouter API error:', errorData);
      
      return NextResponse.json({
        error: true,
        message: errorData.error?.message || 'Unknown error',
        status: modelsResponse.status,
        fullError: errorData
      });
    }

    const modelsData = await modelsResponse.json();
    
    // Test a simple completion with the deepseek model
    const completionResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": SITE_URL,
        "X-Title": SITE_NAME,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-prover-v2:free",
        "messages": [
          {
            "role": "user",
            "content": "Say 'Hello, testing the deepseek model!'"
          }
        ]
      })
    });
    
    let completionData = null;
    let completionError = null;
    
    if (completionResponse.ok) {
      completionData = await completionResponse.json();
    } else {
      try {
        completionError = await completionResponse.json();
      } catch (e) {
        completionError = { message: "Failed to parse error response" };
      }
    }

    return NextResponse.json({
      success: true,
      models: modelsData.data?.map((model: any) => model.id) || [],
      modelCount: modelsData.data?.length || 0,
      deepseekTest: completionData ? {
        success: true,
        response: completionData.choices?.[0]?.message?.content || "No content returned"
      } : {
        success: false,
        error: completionError
      }
    });
  } catch (error) {
    console.error('Error in test API route:', error);
    return NextResponse.json({
      error: true,
      message: (error as Error).message || 'An unexpected error occurred'
    }, { status: 500 });
  }
} 