import Link from "next/link";
import { ArrowRightIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const sections = [
  {
    title: "Capture your milestones",
    description: "Guided prompts make it easy to record vivid memories across every life chapter."
  },
  {
    title: "Transform into narrative",
    description: "Let AI craft a polished autobiography draft in the style that best fits your voice."
  },
  {
    title: "Design & share",
    description: "Customize layout, export to PDF or DOCX, and publish a shareable reading experience."
  }
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 lg:py-24">
      <section className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs uppercase tracking-widest text-white/80">
            <SparklesIcon className="h-4 w-4" />
            Autobiography Data Builder
          </span>
          <h1 className="font-display text-5xl leading-tight text-white lg:text-6xl">
            Build a beautiful autobiography from memories, milestones, and dreams.
          </h1>
          <p className="max-w-xl text-base text-white/70">
            Collect the defining chapters of your life, collaborate with AI to tell the full story,
            visualize your journey, and export a timeless keepsake for your family or readers.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button asChild size="lg">
              <Link href="/register">
                Start Your Story <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>
        <div className="grid gap-6">
          {sections.map((section) => (
            <Card key={section.title} className="border-white/5 bg-white/10 backdrop-blur">
              <h3 className="font-display text-xl text-white">{section.title}</h3>
              <p className="mt-2 text-sm text-white/70">{section.description}</p>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
