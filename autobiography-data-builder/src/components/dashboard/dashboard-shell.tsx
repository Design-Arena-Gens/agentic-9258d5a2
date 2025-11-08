"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { SectionsForm } from "@/components/dashboard/sections-form";
import { TimelineManager } from "@/components/timeline/timeline-manager";
import { StoryGenerator } from "@/components/story/story-generator";
import { CustomizationPanel } from "@/components/dashboard/customization-panel";
import { ExportPanel } from "@/components/dashboard/export-panel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { BiographyDocument } from "@/types/biography";

interface DashboardShellProps {
  initialBiography: BiographyDocument;
  user: {
    name?: string | null;
    email?: string | null;
    role: "user" | "admin";
  };
}

export function DashboardShell({ initialBiography, user }: DashboardShellProps) {
  const [biography, setBiography] = useState(initialBiography);

  return (
    <div className="space-y-10 pb-16">
      <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-white/60">Story workspace</p>
          <h1 className="mt-2 font-display text-4xl text-white">
            Welcome back, {user.name || biography.personalInformation.name || "Storyteller"}.
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/70">
            Progress through each life chapter, then let AI turn your memories into a captivating
            autobiography. Customize every detail and export when you are ready to share.
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-right">
            <p className="text-sm font-semibold text-white">{user.email}</p>
            <p className="text-xs uppercase tracking-wide text-white/50">{user.role}</p>
            <p className="text-xs text-white/60">
              Last updated: {new Date(biography.updatedAt).toLocaleString()}
            </p>
          </div>
          <Button variant="secondary" onClick={() => signOut({ callbackUrl: "/" })}>
            Sign out
          </Button>
        </div>
      </header>

      <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
        <SectionsForm biography={biography} onUpdated={setBiography} />
      </Card>

      <TimelineManager biography={biography} onUpdated={setBiography} />

      <StoryGenerator biography={biography} onUpdated={setBiography} />

      <CustomizationPanel biography={biography} onUpdated={setBiography} />

      <ExportPanel biography={biography} onUpdated={setBiography} />
    </div>
  );
}
