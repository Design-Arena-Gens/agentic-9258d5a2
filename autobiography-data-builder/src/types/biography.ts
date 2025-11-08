export type WritingStyle = "emotional" | "professional" | "simple" | "poetic";

export interface LifeSection<T = string> {
  summary: T;
  prompts?: string[];
}

export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl?: string;
  notes?: string;
}

export interface BiographyCustomization {
  title: string;
  subtitle?: string;
  coverImage?: string;
  fontFamily: string;
  favoriteQuote?: string;
}

import type { ObjectId } from "mongodb";

export interface BiographyDocument {
  _id?: string | ObjectId;
  id?: string;
  userId: string;
  personalInformation: {
    name: string;
    dateOfBirth: string;
    birthplace: string;
    background: string;
  };
  childhoodMemories: LifeSection;
  educationJourney: LifeSection;
  careerAchievements: LifeSection;
  familyRelationships: LifeSection;
  challengesLessons: LifeSection;
  dreamsBeliefs: LifeSection;
  timeline: TimelineEvent[];
  storyDraft?: string;
  style: WritingStyle;
  lastGeneratedAt?: string;
  customization: BiographyCustomization;
  isPublic: boolean;
  publicId?: string;
  updatedAt: string;
  createdAt: string;
}
