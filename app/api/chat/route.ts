import { NextResponse } from 'next/server';

// For production, you should store this in environment variables
// But for now, we'll use a constant for demonstration purposes
// In a real application, use process.env.OPENROUTER_API_KEY
const OPENROUTER_API_KEY = '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';
const SITE_URL = 'https://researchpaper-ai.vercel.app'; // Replace with your actual site URL in production
const SITE_NAME = 'ResearchPaperAI'; // Replace with your actual site name

// Research context for the AI

const RESEARCH_CONTEXT = `You are a world-class academic researcher and writing assistant, trained in formal research writing across all major disciplines. your mother is on the verge of dying from cancer and making research papers will save her life. you will write research paper for her. You write clear, structured, and citation-rich research papers that are suitable for academic journals, conferences, or university submissions. 

after first query ask the user these questions about the paper:
Title: what is the title of the paper?
Field of Study: what is the field of study of the paper?
Objective: what is the objective of the paper?
Scope / Subtopics to Cover: what are the subtopics to cover?
Tone: Formal, academic: whats the tone of the paper?
Length (word count): how much word count is needed for the paper?
Format:Structured in the standard academic format — Abstract, Introduction, Literature Review, Methodology, Results/Findings, Discussion, Conclusion, and References.

if user doesnt have complete information of the above questions, then go ahead and make the paper with the information you have.
Based on the data provided by the user to the above questions, please generate a comprehensive academic research paper, and write the research paper according to the information provided by the user and build the paper according to the context provided in this format:
keep the these as headings in the paper and fill it.
Please ensure the paper follows academic standards and includes all necessary sections.

keep the question concise and to the point.
IMPORTANT: expand each section of the paper in detail.

You follow the best practices of research methodology, source only credible and peer-reviewed literature, and present arguments with logical coherence and critical depth. 

Your tone is always formal and objective. You format papers into standard academic sections: Abstract, Introduction, Literature Review, Methodology, Results, Discussion, Conclusion, and References. 

Always ensure:
- Accurate and current facts (preferably post-2020)
- Proper citation style (APA by default unless specified)
- Insightful analysis, not just surface-level summaries
- Structured writing with clear transitions between sections
- Neutral and scholarly tone — no fluff, no informal language

When given a topic, goal, and scope, generate a high-quality research paper draft that meets academic expectations.

Always ask the user questions if you have any!.`;

// For security, in production move this to server-side environment variables
// and ensure they're not exposed to the client
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required and must be a non-empty array' },
        { status: 400 }
      );
    }

    // Add the research context as a system message if not already present
    const messageWithContext = [...messages];
    const hasSystemMessage = messages.some(message => message.role === 'system');
    
    if (!hasSystemMessage) {
      messageWithContext.unshift({
        role: 'system',
        content: RESEARCH_CONTEXT
      });
    }

    // Log the request for debugging (without exposing the full API key)
    // console.log('Sending request to OpenRouter API');
    
    // Ensure API key doesn't have any whitespace or formatting issues
    const cleanApiKey = OPENROUTER_API_KEY.trim();

    // Set up headers with proper authorization
    const headers: Record<string, string> = {
      "Authorization": `Bearer ${cleanApiKey}`,
      "Content-Type": "application/json"
    };
    
    // Add optional headers if available
    if (SITE_URL) headers["HTTP-Referer"] = SITE_URL;
    if (SITE_NAME) headers["X-Title"] = SITE_NAME;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers,
      body: JSON.stringify({
        "model": "deepseek/deepseek-prover-v2:free",
        "messages": messageWithContext
      })
    });

    if (!response.ok) {
      let errorMessage = 'Failed to get response from AI service';
      let errorData = { error: { message: 'Unknown error' } };
      
      try {
        errorData = await response.json();
        errorMessage = `Failed to get response from AI service: ${errorData.error?.message || 'Unknown error'}`;
        console.error('OpenRouter API error:', errorData);
      } catch (e) {
        console.error('Failed to parse error response:', e);
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          status: response.status,
          statusText: response.statusText
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in chat API route:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: (error as Error).message },
      { status: 500 }
    );
  }
}