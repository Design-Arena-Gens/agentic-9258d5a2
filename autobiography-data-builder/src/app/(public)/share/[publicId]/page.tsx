import Image from "next/image";
import { notFound } from "next/navigation";
import { getBiographyByPublicId } from "@/lib/biography";

interface SharePageProps {
  params: { publicId: string };
}

export default async function SharePage({ params }: SharePageProps) {
  const biography = await getBiographyByPublicId(params.publicId);
  if (!biography) {
    notFound();
  }

  const timeline = biography.timeline ?? [];

  return (
    <main className="min-h-screen bg-slate-950 pb-20 text-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          {biography.customization.coverImage ? (
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10">
              <Image
                src={biography.customization.coverImage}
                alt={biography.customization.title}
                fill
                className="object-cover"
              />
            </div>
          ) : null}
          <div className="space-y-2 text-center">
            <h1 className="font-display text-4xl">{biography.customization.title}</h1>
            {biography.customization.subtitle ? (
              <p className="text-white/70">{biography.customization.subtitle}</p>
            ) : null}
            <p className="text-sm text-white/50">
              {biography.personalInformation.name} ·{" "}
              {biography.personalInformation.birthplace || "Origin unknown"}
            </p>
          </div>
          {biography.customization.favoriteQuote ? (
            <blockquote className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-lg italic text-white/80">
              {biography.customization.favoriteQuote}
            </blockquote>
          ) : null}
        </div>

        <article className="prose prose-invert mx-auto mt-12 max-w-none space-y-6">
          {(biography.storyDraft || "").split("\n").map((paragraph, index) =>
            paragraph.trim() ? (
              <p key={index} className="text-base leading-7 text-white/80">
                {paragraph}
              </p>
            ) : (
              <br key={index} />
            )
          )}

          {!biography.storyDraft ? (
            <div className="space-y-6">
              <section>
                <h2 className="font-display text-2xl">Childhood Memories</h2>
                <p className="text-white/70">{biography.childhoodMemories.summary || "No entry yet."}</p>
              </section>
              <section>
                <h2 className="font-display text-2xl">Education Journey</h2>
                <p className="text-white/70">{biography.educationJourney.summary || "No entry yet."}</p>
              </section>
              <section>
                <h2 className="font-display text-2xl">Career & Achievements</h2>
                <p className="text-white/70">{biography.careerAchievements.summary || "No entry yet."}</p>
              </section>
              <section>
                <h2 className="font-display text-2xl">Family & Relationships</h2>
                <p className="text-white/70">{biography.familyRelationships.summary || "No entry yet."}</p>
              </section>
              <section>
                <h2 className="font-display text-2xl">Life Challenges & Lessons</h2>
                <p className="text-white/70">{biography.challengesLessons.summary || "No entry yet."}</p>
              </section>
              <section>
                <h2 className="font-display text-2xl">Dreams, Beliefs & Future Goals</h2>
                <p className="text-white/70">{biography.dreamsBeliefs.summary || "No entry yet."}</p>
              </section>
            </div>
          ) : null}
        </article>

        {timeline.length ? (
          <section className="mt-12 space-y-4">
            <h2 className="font-display text-3xl">Timeline of milestones</h2>
            <div className="space-y-4">
              {timeline.map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
                >
                  <h3 className="text-xl font-semibold text-white">{event.title}</h3>
                  <p className="text-sm text-white/60">{event.date}</p>
                  <p className="mt-2 text-white/70">{event.description}</p>
                  {event.notes ? (
                    <p className="mt-2 text-sm text-white/60">Notes: {event.notes}</p>
                  ) : null}
                  {event.imageUrl ? (
                    <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        width={800}
                        height={400}
                        className="h-56 w-full object-cover"
                      />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
