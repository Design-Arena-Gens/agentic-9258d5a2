export const SECTION_PROMPTS = {
  childhoodMemories: [
    "What are your earliest memories of home?",
    "Who influenced you most during your childhood?",
    "Describe a moment from childhood that shaped your values."
  ],
  educationJourney: [
    "Which teachers or mentors inspired you?",
    "How did your education impact your life path?",
    "Share a transformative learning experience."
  ],
  careerAchievements: [
    "What motivated your career choices?",
    "Describe a breakthrough moment at work.",
    "Which achievements are you most proud of?"
  ],
  familyRelationships: [
    "Who are the key figures in your family story?",
    "How have relationships evolved over time?",
    "What family traditions mean the most to you?"
  ],
  challengesLessons: [
    "Describe a major challenge and what you learned.",
    "How did adversity change your perspective?",
    "What advice would you give your younger self?"
  ],
  dreamsBeliefs: [
    "What beliefs guide your decisions?",
    "How do you imagine the future?",
    "What legacy do you want to leave?"
  ]
} as const;

export const WRITING_STYLES = [
  { id: "emotional", label: "Emotional", description: "Rich, heartfelt storytelling." },
  { id: "professional", label: "Professional", description: "Clear, structured narrative." },
  { id: "simple", label: "Simple", description: "Accessible, straightforward voice." },
  { id: "poetic", label: "Poetic", description: "Lyrical with imagery and rhythm." }
] as const;
