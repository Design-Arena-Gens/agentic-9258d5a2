"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import type { BiographyDocument } from "@/types/biography";

const FONT_CHOICES = [
  { id: "Inter", label: "Inter (Modern)" },
  { id: "Playfair Display", label: "Playfair Display (Classic)" },
  { id: "Merriweather", label: "Merriweather (Editorial)" },
  { id: "Roboto Serif", label: "Roboto Serif (Clean Serif)" }
] as const;

interface CustomizationPanelProps {
  biography: BiographyDocument;
  onUpdated: (biography: BiographyDocument) => void;
}

export function CustomizationPanel({ biography, onUpdated }: CustomizationPanelProps) {
  const [customization, setCustomization] = useState(() => ({
    title: biography.customization.title,
    subtitle: biography.customization.subtitle ?? "",
    coverImage: biography.customization.coverImage ?? "",
    fontFamily: biography.customization.fontFamily,
    favoriteQuote: biography.customization.favoriteQuote ?? ""
  }));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function update(field: keyof typeof customization, value: string) {
    setCustomization((prev) => ({ ...prev, [field]: value }));
  }

  useEffect(() => {
    setCustomization({
      title: biography.customization.title,
      subtitle: biography.customization.subtitle ?? "",
      coverImage: biography.customization.coverImage ?? "",
      fontFamily: biography.customization.fontFamily,
      favoriteQuote: biography.customization.favoriteQuote ?? ""
    });
  }, [biography.customization]);

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/biographies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customization })
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const data = await res.json();
      onUpdated(data);
      setMessage("Customization updated!");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save customization");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 4000);
    }
  }

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur">
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="space-y-4">
          <h3 className="font-display text-2xl text-white">Design your autobiography</h3>
          <p className="text-sm text-white/60">
            Personalize the look and feel of your final book with a cover image, typography, and a
            meaningful quote.
          </p>
          <div className="space-y-2">
            <label className="text-sm text-white/80">Title</label>
            <Input value={customization.title} onChange={(e) => update("title", e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/80">Subtitle</label>
            <Input
              value={customization.subtitle}
              onChange={(e) => update("subtitle", e.target.value)}
              placeholder="A life lived with purpose"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/80">Favorite quote</label>
            <Textarea
              rows={3}
              value={customization.favoriteQuote}
              onChange={(e) => update("favoriteQuote", e.target.value)}
              placeholder="“The future belongs to those who believe in the beauty of their dreams.”"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/80">Cover image URL</label>
            <Input
              value={customization.coverImage}
              onChange={(e) => update("coverImage", e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/80">Font family</label>
            <div className="grid gap-3 sm:grid-cols-2">
              {FONT_CHOICES.map((font) => (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => update("fontFamily", font.id)}
                  className={`rounded-xl border px-4 py-3 text-left transition ${
                    customization.fontFamily === font.id
                      ? "border-primary-400 bg-primary-500/20 text-white"
                      : "border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:text-white"
                  }`}
                  style={{ fontFamily: font.id }}
                >
                  {font.label}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save customization"}
          </Button>
          {message ? <p className="text-sm text-white/60">{message}</p> : null}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/10 p-6">
          <p className="text-sm uppercase tracking-wide text-white/60">Cover preview</p>
          <div className="mt-4 aspect-[3/4] w-full overflow-hidden rounded-xl border border-white/10 bg-white/5">
            {customization.coverImage ? (
              <Image
                alt="Cover"
                src={customization.coverImage}
                width={400}
                height={520}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-white/50">
                <span>No cover image yet</span>
                <span className="text-xs">Add an image URL to preview your book cover.</span>
              </div>
            )}
          </div>
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-center">
            <p className="font-display text-xl text-white" style={{ fontFamily: customization.fontFamily }}>
              {customization.title || "My Life Story"}
            </p>
            {customization.subtitle ? (
              <p className="text-sm text-white/60">{customization.subtitle}</p>
            ) : null}
            {customization.favoriteQuote ? (
              <blockquote className="mt-4 text-sm italic text-white/70">
                {customization.favoriteQuote}
              </blockquote>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
}
