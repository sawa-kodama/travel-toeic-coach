# Travel TOEIC Coach Scene Expansion Patch

このパッチは、旅行シーン別の問題バリエーションを増やすための更新です。

## 追加内容

- 問題データに `scene` を追加
- レストラン、カフェ、買い物、タクシー、電車、バス、空港、ホテル、観光、トラブル対応、入国審査、支払いのシーンを追加
- 会話形式の問題を追加
- 苦手シーンの記録
- 苦手シーンを優先した自動選定
- 履歴画面に苦手シーン表示
- ホーム画面に次回強化シーン表示

## 上書き対象

- data/questions.ts
- types/question.ts
- types/history.ts
- lib/learning.ts
- components/practice/QuestionCard.tsx
- components/home/ProgressCard.tsx
- components/history/StudyStats.tsx
- components/history/HistoryList.tsx
