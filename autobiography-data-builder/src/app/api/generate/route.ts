import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { ensureBiography, toBiographyResponse, updateStoryDraft } from "@/lib/biography";
import type { BiographyDocument, WritingStyle } from "@/types/biography";

const MODEL_NAME = process.env.GEMINI_MODEL ?? "gemini-1.5-pro";

function buildPrompt(data: BiographyDocument, style: WritingStyle) {
  const styleMap = {
    emotional:
      "Write with emotional depth and warmth. Emphasize sensory detail and internal reflections.",
    professional:
      "Write with clear structure, polished language, and a confident, inspiring tone suited for professional audiences.",
    simple:
      "Write in friendly, easy-to-read language. Use short sentences and conversational tone.",
    poetic:
      "Write lyrically with rich imagery, metaphors, and rhythm while keeping the narrative coherent."
  } as const;

  return `
You are an award-winning memoir writer. Using the data provided, craft a compelling autobiography chapter outline and narrative.

Desired voice: ${style.toUpperCase()} — ${styleMap[style]}.

Structure the response using:
1. Title
2. Subtitle or opening quote
3. Chronological sections with headings (Childhood, Education, Career, Family, Challenges, Dreams)
4. Each section should include paragraphs weaving facts with reflections.
5. Conclude with a resonant closing paragraph about future aspirations.

Personal details:
- Name: ${data.personalInformation.name || "Unknown"}
- Birthdate: ${data.personalInformation.dateOfBirth || "Unknown"}
- Birthplace: ${data.personalInformation.birthplace || "Unknown"}
- Background: ${data.personalInformation.background || "No background provided"}

Childhood memories: ${data.childhoodMemories.summary || "No content"}
Education journey: ${data.educationJourney.summary || "No content"}
Career & achievements: ${data.careerAchievements.summary || "No content"}
Family & relationships: ${data.familyRelationships.summary || "No content"}
Life challenges & lessons: ${data.challengesLessons.summary || "No content"}
Dreams, beliefs & future goals: ${data.dreamsBeliefs.summary || "No content"}

Timeline events:
${data.timeline
  .map(
    (event, index) =>
      `${index + 1}. ${event.title} (${event.date}) - ${event.description}${
        event.notes ? ` Notes: ${event.notes}` : ""
      }`
  )
  .join("\n") || "No events provided"}

Blend the timeline into the narrative where natural. Avoid repeating raw bullet lists. Produce Markdown-friendly output.`;
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY is not configured." }, { status: 500 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const style = (payload?.style ?? "emotional") as WritingStyle;

    const biography = await ensureBiography(session.user.id);
    const prompt = buildPrompt(biography, style);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const response = await model.generateContent(prompt);
    const text = response.response.text().trim();

    const updated = await updateStoryDraft(session.user.id, text, style);
    return NextResponse.json({
      story: text,
      biography: toBiographyResponse(updated)
    });
  } catch (error) {
    console.error("[GENERATE_STORY]", error);
    return NextResponse.json({ error: "Failed to generate story" }, { status: 500 });
  }
}
