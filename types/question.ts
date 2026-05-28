export type Choice = {
  id: "A" | "B" | "C" | "D";
  text: string;
};

export type Question = {
  id: number;
  part: "Part 5";
  category: string;
  prompt: string;
  choices: Choice[];
  answerId: Choice["id"];
  explanation: string;
};
