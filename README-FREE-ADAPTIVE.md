# Travel TOEIC Coach 無料パーソナライズ強化パッチ

このパッチはOpenAI APIを使わず、固定問題とlocalStorageの学習履歴だけで以下を実装します。

- 正答率の記録
- 苦手カテゴリの記録
- ミスした選択肢語句の記録
- 連続学習日数の表示
- 正答率に応じた難易度推定
  - 80%以上: advanced
  - 60〜79%: intermediate
  - 59%以下: beginner
- 苦手カテゴリを優先した問題選定
- 問題カテゴリ分岐
  - 前置詞
  - 時制
  - 語彙
  - 品詞
  - ビジネス英語
  - 旅行英語

## 上書きファイル

- types/question.ts
- types/history.ts
- lib/learning.ts
- data/questions.ts
- components/practice/QuestionCard.tsx
- components/home/ProgressCard.tsx
- components/history/StudyStats.tsx
- components/history/HistoryList.tsx

## 注意

.env.local は含めていません。APIキーも不要です。
