export type VocabularyWord = {
  id: number;
  word: string;
  meaning: string;
  category:
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
  example: string;
  exampleJa: string;
  learned: boolean;
};
