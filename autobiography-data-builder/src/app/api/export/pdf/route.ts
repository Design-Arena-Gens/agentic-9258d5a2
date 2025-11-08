import PDFDocument from "pdfkit";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { ensureBiography } from "@/lib/biography";

function buildContentFromBiography(biography: Awaited<ReturnType<typeof ensureBiography>>) {
  const lines: string[] = [];
  lines.push(`# ${biography.customization.title || "Autobiography"}`);
  if (biography.customization.subtitle) {
    lines.push(`## ${biography.customization.subtitle}`);
  }
  lines.push("");
  const pi = biography.personalInformation;
  lines.push(`**Name:** ${pi.name || "N/A"}`);
  lines.push(`**Date of birth:** ${pi.dateOfBirth || "N/A"}`);
  lines.push(`**Birthplace:** ${pi.birthplace || "N/A"}`);
  lines.push(`**Background:** ${pi.background || "N/A"}`);
  lines.push("");
  lines.push("### Childhood Memories");
  lines.push(biography.childhoodMemories.summary || "No content provided.");
  lines.push("");
  lines.push("### Education Journey");
  lines.push(biography.educationJourney.summary || "No content provided.");
  lines.push("");
  lines.push("### Career & Achievements");
  lines.push(biography.careerAchievements.summary || "No content provided.");
  lines.push("");
  lines.push("### Family & Relationships");
  lines.push(biography.familyRelationships.summary || "No content provided.");
  lines.push("");
  lines.push("### Life Challenges & Lessons");
  lines.push(biography.challengesLessons.summary || "No content provided.");
  lines.push("");
  lines.push("### Dreams, Beliefs & Future Goals");
  lines.push(biography.dreamsBeliefs.summary || "No content provided.");
  lines.push("");
  if (biography.timeline.length) {
    lines.push("### Timeline Highlights");
    biography.timeline.forEach((event) => {
      lines.push(`${event.date} — ${event.title}`);
      lines.push(event.description);
      if (event.notes) {
        lines.push(`Notes: ${event.notes}`);
      }
      lines.push("");
    });
  }
  if (biography.customization.favoriteQuote) {
    lines.push(`> ${biography.customization.favoriteQuote}`);
  }
  return lines.join("\n");
}

async function renderPdf(content: string, title: string) {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ size: "LETTER", margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", (err) => reject(err));

    doc.fontSize(20).text(title, { align: "center" }).moveDown();
    const paragraphs = content.split("\n");
    paragraphs.forEach((line) => {
      if (line.startsWith("# ")) {
        doc.moveDown().fontSize(22).text(line.replace("# ", ""));
      } else if (line.startsWith("## ")) {
        doc.moveDown().fontSize(16).text(line.replace("## ", ""));
      } else if (line.startsWith("### ")) {
        doc.moveDown().fontSize(14).text(line.replace("### ", ""));
      } else if (line.startsWith("**")) {
        doc.fontSize(12).text(line.replace(/\*\*/g, ""), { continued: false });
      } else if (line.startsWith("> ")) {
        doc.moveDown().fontSize(12).fillColor("#666666").text(line.replace("> ", ""), {
          align: "center"
        });
        doc.fillColor("#000000");
      } else if (line.trim().length === 0) {
        doc.moveDown();
      } else {
        doc.fontSize(12).text(line, { align: "left" });
      }
    });

    doc.end();
  });
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
    const title = payload.title ?? biography.customization.title ?? "Autobiography";

    const content = story ?? biography.storyDraft ?? buildContentFromBiography(biography);
    const buffer = await renderPdf(content, title);
    const filename = `${title.replace(/\s+/g, "_").toLowerCase()}.pdf`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`
      }
    });
  } catch (error) {
    console.error("[EXPORT_PDF]", error);
    return NextResponse.json({ error: "Failed to export PDF" }, { status: 500 });
  }
}
