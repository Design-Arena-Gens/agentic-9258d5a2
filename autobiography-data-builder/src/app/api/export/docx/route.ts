import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { ensureBiography } from "@/lib/biography";

function buildParagraphs(content: string) {
  const paragraphs: Paragraph[] = [];
  const lines = content.split("\n");

  lines.forEach((line) => {
    if (!line.trim()) {
      paragraphs.push(new Paragraph({ text: "", spacing: { after: 200 } }));
      return;
    }

    if (line.startsWith("# ")) {
      paragraphs.push(
        new Paragraph({
          text: line.replace("# ", ""),
          heading: HeadingLevel.TITLE
        })
      );
      return;
    }

    if (line.startsWith("## ")) {
      paragraphs.push(
        new Paragraph({
          text: line.replace("## ", ""),
          heading: HeadingLevel.HEADING_2
        })
      );
      return;
    }

    if (line.startsWith("### ")) {
      paragraphs.push(
        new Paragraph({
          text: line.replace("### ", ""),
          heading: HeadingLevel.HEADING_3
        })
      );
      return;
    }

    if (line.startsWith("> ")) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line.replace("> ", ""),
              italics: true
            })
          ],
          spacing: { after: 200 }
        })
      );
      return;
    }

    paragraphs.push(
      new Paragraph({
        children: [new TextRun(line)],
        spacing: { after: 200 }
      })
    );
  });

  return paragraphs;
}

function fallbackContent(biography: Awaited<ReturnType<typeof ensureBiography>>) {
  const segments: string[] = [];
  segments.push(`# ${biography.customization.title || "Autobiography"}`);
  if (biography.customization.subtitle) {
    segments.push(`## ${biography.customization.subtitle}`);
  }
  segments.push("");
  segments.push("### Personal Information");
  segments.push(`Name: ${biography.personalInformation.name || "N/A"}`);
  segments.push(`Date of birth: ${biography.personalInformation.dateOfBirth || "N/A"}`);
  segments.push(`Birthplace: ${biography.personalInformation.birthplace || "N/A"}`);
  segments.push(`Background: ${biography.personalInformation.background || "N/A"}`);
  segments.push("");
  segments.push("### Childhood Memories");
  segments.push(biography.childhoodMemories.summary || "No content provided.");
  segments.push("");
  segments.push("### Education Journey");
  segments.push(biography.educationJourney.summary || "No content provided.");
  segments.push("");
  segments.push("### Career & Achievements");
  segments.push(biography.careerAchievements.summary || "No content provided.");
  segments.push("");
  segments.push("### Family & Relationships");
  segments.push(biography.familyRelationships.summary || "No content provided.");
  segments.push("");
  segments.push("### Life Challenges & Lessons");
  segments.push(biography.challengesLessons.summary || "No content provided.");
  segments.push("");
  segments.push("### Dreams, Beliefs & Future Goals");
  segments.push(biography.dreamsBeliefs.summary || "No content provided.");
  if (biography.customization.favoriteQuote) {
    segments.push("");
    segments.push(`> ${biography.customization.favoriteQuote}`);
  }
  return segments.join("\n");
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const biography = await ensureBiography(session.user.id);
    const payload = await request.json().catch(() => ({}));
    const story = typeof payload.story === "string" && payload.story.length > 0 ? payload.story : null;
    const content = story ?? biography.storyDraft ?? fallbackContent(biography);

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: buildParagraphs(content)
        }
      ]
    });

    const buffer = await Packer.toBuffer(doc);
    const filename = `${(biography.customization.title || "autobiography")
      .replace(/\s+/g, "_")
      .toLowerCase()}.docx`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`
      }
    });
  } catch (error) {
    console.error("[EXPORT_DOCX]", error);
    return NextResponse.json({ error: "Failed to export DOCX" }, { status: 500 });
  }
}
