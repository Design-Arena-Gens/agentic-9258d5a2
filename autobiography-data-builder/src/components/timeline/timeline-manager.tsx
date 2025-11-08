"use client";

import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import type { BiographyDocument, TimelineEvent } from "@/types/biography";

interface TimelineManagerProps {
  biography: BiographyDocument;
  onUpdated: (biography: BiographyDocument) => void;
}

const emptyEvent = (): TimelineEvent => ({
  id: uuid(),
  title: "",
  date: "",
  description: "",
  imageUrl: "",
  notes: ""
});

export function TimelineManager({ biography, onUpdated }: TimelineManagerProps) {
  const [events, setEvents] = useState<TimelineEvent[]>(
    biography.timeline.length ? biography.timeline : [emptyEvent()]
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setEvents(biography.timeline.length ? biography.timeline : [emptyEvent()]);
  }, [biography.timeline]);

  function updateEvent(id: string, field: keyof TimelineEvent, value: string) {
    setEvents((prev) => prev.map((event) => (event.id === id ? { ...event, [field]: value } : event)));
  }

  function addEvent() {
    setEvents((prev) => [...prev, emptyEvent()]);
  }

  function removeEvent(id: string) {
    setEvents((prev) => (prev.length === 1 ? prev : prev.filter((event) => event.id !== id)));
  }

  async function saveTimeline() {
    setSaving(true);
    setMessage(null);
    try {
      const sanitized = events
        .filter((event) => event.title.trim().length > 0 && event.date)
        .map((event) => ({
          ...event,
          title: event.title.trim(),
          description: event.description.trim(),
          notes: event.notes?.trim() ?? "",
          imageUrl: event.imageUrl?.trim() ?? ""
        }));

      const res = await fetch("/api/timeline", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeline: sanitized })
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      onUpdated(data);
      setMessage("Timeline saved!");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save timeline");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 4000);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h3 className="font-display text-2xl text-white">Life timeline</h3>
          <p className="text-sm text-white/60">
            Plot milestones, add images, and annotate notes to visualize your journey.
          </p>
        </div>
        <Button onClick={addEvent} variant="secondary">
          Add event
        </Button>
      </div>

      <div className="space-y-5">
        {events.map((event, idx) => (
          <Card key={event.id} className="border-white/10 bg-white/5 backdrop-blur">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-lg text-white">Event {idx + 1}</h4>
              <Button variant="ghost" onClick={() => removeEvent(event.id)}>
                Remove
              </Button>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm text-white/80">Title</label>
                <Input
                  value={event.title}
                  onChange={(e) => updateEvent(event.id, "title", e.target.value)}
                  placeholder="Graduated from university"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/80">Date</label>
                <Input type="date" value={event.date ? event.date.slice(0, 10) : ""} onChange={(e) => updateEvent(event.id, "date", e.target.value)} />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <label className="text-sm text-white/80">Description</label>
              <Textarea
                rows={4}
                value={event.description}
                onChange={(e) => updateEvent(event.id, "description", e.target.value)}
                placeholder="Describe why this moment mattered."
              />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm text-white/80">Image URL (optional)</label>
                <Input
                  value={event.imageUrl}
                  onChange={(e) => updateEvent(event.id, "imageUrl", e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/80">Notes (optional)</label>
                <Textarea
                  rows={2}
                  value={event.notes}
                  onChange={(e) => updateEvent(event.id, "notes", e.target.value)}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={saveTimeline} disabled={saving}>
          {saving ? (
            <>
              <Spinner className="mr-2 h-4 w-4" /> Saving...
            </>
          ) : (
            "Save timeline"
          )}
        </Button>
        {message ? <p className="text-sm text-white/60">{message}</p> : null}
      </div>
    </div>
  );
}
