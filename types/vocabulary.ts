export type VocabularyWord = {
  id: number;
  word: string;
  meaning: string;
  category: "Hotel" | "Airport" | "Restaurant" | "Transportation" | "Business Travel";
  example: string;
  exampleJa: string;
  learned: boolean;
};
