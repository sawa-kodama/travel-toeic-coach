import type { VocabularyWord } from "@/types/vocabulary";

export const vocabulary: VocabularyWord[] = [
  { id: 1, word: "reservation", meaning: "予約", category: "Hotel", example: "I have a reservation for tonight.", exampleJa: "今夜の予約があります。", learned: false },
  { id: 2, word: "boarding pass", meaning: "搭乗券", category: "Airport", example: "Please show your boarding pass.", exampleJa: "搭乗券を見せてください。", learned: false },
  { id: 3, word: "departure", meaning: "出発", category: "Airport", example: "The departure time has changed.", exampleJa: "出発時刻が変更されました。", learned: true },
  { id: 4, word: "receipt", meaning: "領収書", category: "Business Travel", example: "Could I have a receipt, please?", exampleJa: "領収書をいただけますか。", learned: false },
  { id: 5, word: "shuttle", meaning: "送迎バス", category: "Transportation", example: "The hotel shuttle leaves every hour.", exampleJa: "ホテルの送迎バスは毎時出発します。", learned: true },
  { id: 6, word: "available", meaning: "利用できる・空いている", category: "Hotel", example: "Are there any rooms available?", exampleJa: "空いている部屋はありますか。", learned: false },
  { id: 7, word: "recommend", meaning: "おすすめする", category: "Restaurant", example: "What dish do you recommend?", exampleJa: "どの料理がおすすめですか。", learned: false },
  { id: 8, word: "itinerary", meaning: "旅程", category: "Business Travel", example: "Please review the itinerary before the trip.", exampleJa: "出張前に旅程を確認してください。", learned: false }
];
