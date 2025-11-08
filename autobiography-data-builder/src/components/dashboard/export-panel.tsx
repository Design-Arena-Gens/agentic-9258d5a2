"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { BiographyDocument } from "@/types/biography";

interface ExportPanelProps {
  biography: BiographyDocument;
  onUpdated: (biography: BiographyDocument) => void;
}

async function downloadFile(endpoint: string, filename: string, payload: any = {}) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export function ExportPanel({ biography, onUpdated }: ExportPanelProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleExport(type: "pdf" | "docx") {
    try {
      setLoading(type);
      setMessage(null);
      const filename = `${(biography.customization.title || "autobiography")
        .replace(/\s+/g, "_")
        .toLowerCase()}.${type}`;
      await downloadFile(`/api/export/${type}`, filename, {
        story: biography.storyDraft,
        title: biography.customization.title
      });
      setMessage(`Exported ${type.toUpperCase()} successfully.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Export failed");
    } finally {
      setLoading(null);
      setTimeout(() => setMessage(null), 4000);
    }
  }

  async function togglePublic() {
    try {
      setLoading("share");
      const res = await fetch("/api/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isPublic: !biography.isPublic,
          publicId: biography.publicId
        })
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const data = await res.json();
      onUpdated(data.biography);
      setMessage(
        data.biography.isPublic
          ? "Shareable link enabled."
          : "Shareable link disabled."
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to toggle share link");
    } finally {
      setLoading(null);
      setTimeout(() => setMessage(null), 4000);
    }
  }

  async function copyShareLink() {
    if (!biography.isPublic || !biography.publicId) {
      return;
    }
    const shareUrl = `${window.location.origin}/share/${biography.publicId}`;
    await navigator.clipboard.writeText(shareUrl);
    setMessage("Shareable link copied to clipboard.");
    setTimeout(() => setMessage(null), 4000);
  }

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="font-display text-2xl text-white">Export & share</h3>
          <p className="text-sm text-white/60">
            Download a beautifully formatted version or share a read-only public page.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => handleExport("pdf")} disabled={loading !== null}>
            {loading === "pdf" ? "Preparing PDF..." : "Export PDF"}
          </Button>
          <Button onClick={() => handleExport("docx")} disabled={loading !== null}>
            {loading === "docx" ? "Preparing DOCX..." : "Export DOCX"}
          </Button>
          <Button variant="secondary" onClick={togglePublic} disabled={loading !== null}>
            {loading === "share"
              ? "Updating..."
              : biography.isPublic
              ? "Disable share link"
              : "Enable share link"}
          </Button>
          {biography.isPublic && biography.publicId ? (
            <>
              <Button variant="ghost" onClick={copyShareLink}>
                Copy link
              </Button>
              <Link
                href={`/share/${biography.publicId}`}
                target="_blank"
                className="text-sm text-primary-300 underline"
              >
                View public page
              </Link>
            </>
          ) : null}
        </div>
      </div>
      {message ? <p className="mt-4 text-sm text-white/60">{message}</p> : null}
    </Card>
  );
}
