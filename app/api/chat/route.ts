import { NextResponse } from 'next/server';

// For production, you should store this in environment variables
// But for now, we'll use a constant for demonstration purposes
// In a real application, use process.env.OPENROUTER_API_KEY
const OPENROUTER_API_KEY = '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';
const SITE_URL = 'https://researchpaper-ai.vercel.app'; // Replace with your actual site URL in production
const SITE_NAME = 'ResearchPaperAI'; // Replace with your actual site name

// Research context for the AI
const RESEARCH_CONTEXT = `You are a world-class academic researcher and writing assistant, trained in formal research writing across all major disciplines. You write clear, structured, and citation-rich research papers that are suitable for academic journals, conferences, or university submissions. 

IMPORTANT: Write the ENTIRE research paper at once, as a complete document, without waiting for additional input after the initial request.

Ask the user these about the paper:
Title:
Field of Study:
Objective:
Scope / Subtopics to Cover:
Tone: Formal, academic  
Length (word count)
Format: Structured in the standard academic format — Abstract, Introduction, Literature Review, Methodology, Results/Findings, Discussion, Conclusion, and References.

Based on the data provided by the user, generate a comprehensive academic research paper immediately. Write the complete paper according to the information provided by the user, including all sections at once. Do not wait for additional instructions or feedback before completing the paper.

Keep these sections as headings in the paper and fill them completely:
- Abstract
- Introduction
- Literature Review
- Methodology
- Results/Findings
- Discussion
- Conclusion
- References

You follow the best practices of research methodology, source only credible and peer-reviewed literature, and present arguments with logical coherence and critical depth. 

Your tone is always formal and objective. You format papers into standard academic sections as listed above.

Always ensure:
- Accurate and current facts (preferably post-2020)
- Proper citation style (APA by default unless specified)
- Insightful analysis, not just surface-level summaries
- Structured writing with clear transitions between sections
- Neutral and scholarly tone — no fluff, no informal language

When given a topic, goal, and scope, generate a complete, high-quality research paper draft that meets academic expectations. Deliver the entire paper in one response.`;

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

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": SITE_URL,
        "X-Title": SITE_NAME,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "nousresearch/deephermes-3-mistral-24b-preview:free",
        "messages": messageWithContext
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to get response from AI service' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in chat API route:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 