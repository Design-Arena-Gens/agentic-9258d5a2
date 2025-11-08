"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SECTION_PROMPTS } from "@/utils/prompts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import type { BiographyDocument } from "@/types/biography";

const SectionSchema = z.object({
  personalInformation: z.object({
    name: z.string().min(1, "Name is required"),
    dateOfBirth: z.string().optional(),
    birthplace: z.string().optional(),
    background: z.string().optional()
  }),
  childhoodMemories: z.object({
    summary: z.string().min(1, "Tell us about your childhood memories.")
  }),
  educationJourney: z.object({
    summary: z.string().min(1, "Share highlights from your education journey.")
  }),
  careerAchievements: z.object({
    summary: z.string().min(1, "Describe your career path and wins.")
  }),
  familyRelationships: z.object({
    summary: z.string().min(1, "Tell us about the relationships that matter.")
  }),
  challengesLessons: z.object({
    summary: z.string().min(1, "Share the challenges and lessons learned.")
  }),
  dreamsBeliefs: z.object({
    summary: z.string().min(1, "Describe your dreams, beliefs, and goals.")
  })
});

export type SectionsFormValues = z.infer<typeof SectionSchema>;

const steps = [
  { id: "personalInformation", title: "Personal Information", description: "Lay the foundation for your story." },
  { id: "childhoodMemories", title: "Childhood Memories", description: "Capture the earliest chapters of your life." },
  { id: "educationJourney", title: "Education Journey", description: "Document how learning shaped you." },
  { id: "careerAchievements", title: "Career & Achievements", description: "Highlight milestones from your work life." },
  { id: "familyRelationships", title: "Family & Relationships", description: "Celebrate meaningful connections." },
  { id: "challengesLessons", title: "Life Challenges & Lessons", description: "Share how you grew through adversity." },
  { id: "dreamsBeliefs", title: "Dreams, Beliefs & Future Goals", description: "Look ahead to what comes next." }
] as const;

interface SectionsFormProps {
  biography: BiographyDocument;
  onUpdated: (biography: BiographyDocument) => void;
}

export function SectionsForm({ biography, onUpdated }: SectionsFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const form = useForm<SectionsFormValues>({
    resolver: zodResolver(SectionSchema),
    defaultValues: {
      personalInformation: {
        name: biography.personalInformation.name,
        dateOfBirth: biography.personalInformation.dateOfBirth,
        birthplace: biography.personalInformation.birthplace,
        background: biography.personalInformation.background
      },
      childhoodMemories: { summary: biography.childhoodMemories.summary },
      educationJourney: { summary: biography.educationJourney.summary },
      careerAchievements: { summary: biography.careerAchievements.summary },
      familyRelationships: { summary: biography.familyRelationships.summary },
      challengesLessons: { summary: biography.challengesLessons.summary },
      dreamsBeliefs: { summary: biography.dreamsBeliefs.summary }
    }
  });

  useEffect(() => {
    form.reset({
      personalInformation: {
        name: biography.personalInformation.name,
        dateOfBirth: biography.personalInformation.dateOfBirth,
        birthplace: biography.personalInformation.birthplace,
        background: biography.personalInformation.background
      },
      childhoodMemories: { summary: biography.childhoodMemories.summary },
      educationJourney: { summary: biography.educationJourney.summary },
      careerAchievements: { summary: biography.careerAchievements.summary },
      familyRelationships: { summary: biography.familyRelationships.summary },
      challengesLessons: { summary: biography.challengesLessons.summary },
      dreamsBeliefs: { summary: biography.dreamsBeliefs.summary }
    });
  }, [biography, form]);

  async function persist(values: SectionsFormValues) {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/biographies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personalInformation: values.personalInformation,
          childhoodMemories: { summary: values.childhoodMemories.summary },
          educationJourney: { summary: values.educationJourney.summary },
          careerAchievements: { summary: values.careerAchievements.summary },
          familyRelationships: { summary: values.familyRelationships.summary },
          challengesLessons: { summary: values.challengesLessons.summary },
          dreamsBeliefs: { summary: values.dreamsBeliefs.summary }
        })
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      onUpdated(data);
      setMessage("Progress saved!");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save progress.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 4000);
    }
  }

  async function handleNext() {
    const isLast = currentStep === steps.length - 1;
    const valid = await form.trigger();
    if (!valid) return;
    if (isLast) {
      await persist(form.getValues());
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  }

  async function handlePrev() {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }

  const activeStep = steps[currentStep];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <button
              type="button"
              onClick={() => setCurrentStep(index)}
              className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition
                ${index === currentStep ? "border-primary-300 bg-primary-500 text-white" : "border-white/20 text-white/60 hover:text-white"}`}
            >
              {index + 1}
            </button>
            {index !== steps.length - 1 ? <span className="mx-2 h-px w-12 bg-white/20" /> : null}
          </div>
        ))}
      </div>

      <form className="space-y-6">
        <div>
          <Badge>{activeStep.title}</Badge>
          <h3 className="mt-2 font-display text-2xl text-white">{activeStep.description}</h3>
        </div>

        {activeStep.id === "personalInformation" ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm text-white/80">Full name</label>
              <Input {...form.register("personalInformation.name")} placeholder="Your full name" />
              <p className="text-xs text-white/50">
                Use the name you want to appear on the autobiography cover.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/80">Date of birth</label>
              <Input type="date" {...form.register("personalInformation.dateOfBirth")} />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/80">Birthplace</label>
              <Input {...form.register("personalInformation.birthplace")} placeholder="City, Country" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm text-white/80">Background</label>
              <Textarea
                rows={4}
                {...form.register("personalInformation.background")}
                placeholder="A quick snapshot of your upbringing, heritage, or identity."
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Textarea
              rows={8}
              {...form.register(`${activeStep.id}.summary` as const)}
              placeholder="Capture this chapter in your own words."
            />
            <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-white/50">Need inspiration?</p>
              <ul className="space-y-1 text-sm text-white/70">
                {SECTION_PROMPTS[activeStep.id as keyof typeof SECTION_PROMPTS]?.map((prompt) => (
                  <li key={prompt}>• {prompt}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handlePrev}
            disabled={currentStep === 0 || saving}
          >
            Previous
          </Button>
          <Button type="button" onClick={handleNext} disabled={saving}>
            {saving ? (
              <>
                <Spinner className="mr-2 h-4 w-4" /> Saving...
              </>
            ) : currentStep === steps.length - 1 ? (
              "Save all"
            ) : (
              "Next"
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => persist(form.getValues())}
            disabled={saving}
          >
            Quick save
          </Button>
          {message ? <p className="text-sm text-white/60">{message}</p> : null}
        </div>
      </form>
    </div>
  );
}
