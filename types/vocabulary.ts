export type VocabularyCategory =
  | "Hotel"
  | "Airport"
  | "Restaurant"
  | "Cafe"
  | "Shopping"
  | "Transportation"
  | "Taxi"
  | "Train"
  | "Bus"
  | "Sightseeing"
  | "Emergency"
  | "Immigration"
  | "Payment"
  | "Business Travel";

export type VocabularyWord = {
  id: number;
  rank: number;
  word: string;
  meaning: string;
  category: VocabularyCategory;
  example: string;
  exampleJa: string;
  learned: boolean;
};
