"use client";

import { useEffect, useState } from "react";
import { WRITING_STYLES } from "@/utils/prompts";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import type { BiographyDocument, WritingStyle } from "@/types/biography";

interface StoryGeneratorProps {
  biography: BiographyDocument;
  onUpdated: (biography: BiographyDocument) => void;
}

export function StoryGenerator({ biography, onUpdated }: StoryGeneratorProps) {
  const [style, setStyle] = useState<WritingStyle>(biography.style ?? "emotional");
  const [story, setStory] = useState(biography.storyDraft ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setStory(biography.storyDraft ?? "");
    setStyle(biography.style ?? "emotional");
  }, [biography.storyDraft, biography.style]);

  async function generateStory() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ style })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Failed to generate story");
      }

      const data = await res.json();
      setStory(data.story);
      onUpdated(data.biography);
      setMessage("New draft generated!");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to generate story");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 4000);
    }
  }

  async function saveStory() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/biographies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyDraft: story,
          style
        })
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const data = await res.json();
      onUpdated(data);
      setMessage("Draft saved!");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 4000);
    }
  }

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4 lg:w-1/3">
          <div>
            <h3 className="font-display text-2xl text-white">AI story generator</h3>
            <p className="text-sm text-white/60">
              Choose a writing style and let our Gemini-powered assistant craft a draft. Refine it
              in the editor.
            </p>
          </div>
          <div className="space-y-3">
            {WRITING_STYLES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setStyle(item.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                  style === item.id
                    ? "border-primary-400 bg-primary-500/20 text-white"
                    : "border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:text-white"
                }`}
              >
                <p className="font-semibold capitalize">{item.label}</p>
                <p className="text-xs text-white/60">{item.description}</p>
              </button>
            ))}
          </div>
          <Button onClick={generateStory} disabled={loading}>
            {loading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" /> Generating...
              </>
            ) : (
              "Generate draft"
            )}
          </Button>
          {biography.lastGeneratedAt ? (
            <p className="text-xs text-white/50">
              Last generated: {new Date(biography.lastGeneratedAt).toLocaleString()}
            </p>
          ) : null}
        </div>

        <div className="lg:w-2/3">
          <Textarea
            rows={24}
            value={story}
            onChange={(event) => setStory(event.target.value)}
            placeholder="The AI-generated autobiography draft will appear here. Feel free to edit and personalize every line."
            className="h-full min-h-[400px] bg-white/10"
          />
          <div className="mt-4 flex items-center gap-3">
            <Button onClick={saveStory} disabled={loading || story.trim().length === 0}>
              Save edits
            </Button>
            {message ? <p className="text-sm text-white/60">{message}</p> : null}
          </div>
        </div>
      </div>
    </Card>
  );
}
