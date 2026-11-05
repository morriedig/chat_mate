# Chat Mate visual design specification

Status: implementation-ready for Vue 3, Tailwind CSS v4, Capacitor/WKWebView. The phone layout (320–430 px) is the source of truth. Preserve every current feature, content group, and section order.

## Direction

- **Product:** A daily speaking loop for Taiwanese adults who know English on paper but need a safe, low-pressure way to retrieve it aloud.
- **Character:** Observant, companionable, editorial.
- **World:** A well-used language-exchange notebook in a quiet Taipei café: warm paper, dark graphite, blue-green fountain-pen marks.
- **Moments:** The three-step route on Home and the live mission strip in task chat receive the only concentrated accent treatment.
- **Signature:** Every active learning task uses one short blue-green left-margin rule ending in a square step marker; never use decorative gradients, glows, or confetti.

Dials: `DESIGN_VARIANCE 4/10`, `MOTION_INTENSITY 2/10`, `VISUAL_DENSITY 6/10`.

Aesthetic reference: the material restraint of a Japanese field notebook, the editorial hierarchy of a language workbook, and the behavioral familiarity of iOS Messages. This is not a school dashboard and not a children’s game. It should still be identifiable as Chat Mate with the logo removed because the route, margin marker, English pattern chips, and friend conversation are specific to speaking practice.

## Foundation tokens

### Paste-ready Tailwind v4 CSS

Replace the token portion of `frontend/src/style.css` with the following. Keep the existing safe-area utilities and overflow helpers after this block. Vendor both font files into the app bundle; do not depend on Google Fonts at runtime.

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

/* Bundle this file at frontend/src/assets/fonts/Figtree-Variable.woff2.
   Source: official Figtree release, weights 400–600, Latin subset. */
@font-face {
  font-family: "Figtree";
  src: url("./assets/fonts/Figtree-Variable.woff2") format("woff2-variations");
  font-style: normal;
  font-weight: 400 600;
  font-display: swap;
}

/* Bundle the existing icon face at frontend/src/assets/fonts/MaterialSymbolsOutlined.woff2.
   Remove the Google Fonts <link> from index.html after vendoring it. */
@font-face {
  font-family: "Material Symbols Outlined";
  src: url("./assets/fonts/MaterialSymbolsOutlined.woff2") format("woff2");
  font-style: normal;
  font-weight: 100 700;
  font-display: block;
}

@theme {
  --font-sans: "Figtree", "PingFang TC", "Noto Sans TC", "Hiragino Sans", system-ui, sans-serif;

  --color-page: var(--cm-page);
  --color-surface: var(--cm-surface);
  --color-surface-raised: var(--cm-surface-raised);
  --color-surface-sunken: var(--cm-surface-sunken);
  --color-ink: var(--cm-text-primary);
  --color-ink-secondary: var(--cm-text-secondary);
  --color-ink-muted: var(--cm-text-muted);
  --color-accent: var(--cm-accent);
  --color-accent-pressed: var(--cm-accent-pressed);
  --color-accent-disabled: var(--cm-accent-disabled);
  --color-on-accent: var(--cm-on-accent);
  --color-accent-soft: var(--cm-accent-soft);
  --color-success: var(--cm-success);
  --color-success-soft: var(--cm-success-soft);
  --color-warning: var(--cm-warning);
  --color-warning-soft: var(--cm-warning-soft);
  --color-error: var(--cm-error);
  --color-error-soft: var(--cm-error-soft);
  --color-hairline: var(--cm-border);

  --radius-xs: 6px;
  --radius-sm: 10px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-sheet: 24px;

  --text-meta: 0.75rem;
  --text-meta--line-height: 1rem;
  --text-caption: 0.8125rem;
  --text-caption--line-height: 1.25rem;
  --text-body: 0.9375rem;
  --text-body--line-height: 1.5rem;
  --text-title: 1.0625rem;
  --text-title--line-height: 1.5rem;
  --text-section: 1.3125rem;
  --text-section--line-height: 1.75rem;
  --text-display: 1.75rem;
  --text-display--line-height: 2.25rem;

  --ease-cm: cubic-bezier(0.22, 1, 0.36, 1);
  --animate-cm-enter: cm-enter 360ms var(--ease-cm) both;
}

:root {
  color-scheme: light;
  --cm-page: #F6F3EC;
  --cm-surface: #FFFCF6;
  --cm-surface-raised: #ECE9E1;
  --cm-surface-sunken: #EFEBE3;
  --cm-text-primary: #1B2527;
  --cm-text-secondary: #4E5D5E;
  --cm-text-muted: #63706F;
  --cm-accent: #0E6674;
  --cm-accent-pressed: #0B525D;
  --cm-accent-disabled: #9BB7B9;
  --cm-on-accent: #FFFCF6;
  --cm-accent-soft: #DDECEF;
  --cm-success: #247A4B;
  --cm-success-soft: #E7F3EA;
  --cm-warning: #9A6413;
  --cm-warning-soft: #F8EDD8;
  --cm-error: #B9413E;
  --cm-error-soft: #F8E8E5;
  --cm-border: #1B252714;
  --cm-focus: #0E6674;
  --cm-focus-ring: #0E667433;
  --cm-scrim: #17212370;
  --cm-shadow-small: 0 1px 2px rgb(27 37 39 / 0.05);
  --cm-shadow-float: 0 8px 24px rgb(27 37 39 / 0.08);

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  --motion-micro: 140ms;
  --motion-control: 180ms;
  --motion-sheet: 280ms;
  --motion-enter: 360ms;
  --ease-cm: cubic-bezier(0.22, 1, 0.36, 1);
}

.dark {
  color-scheme: dark;
  --cm-page: #131918;
  --cm-surface: #192120;
  --cm-surface-raised: #232D2B;
  --cm-surface-sunken: #101514;
  --cm-text-primary: #F0F3EE;
  --cm-text-secondary: #B5BFBA;
  --cm-text-muted: #929E99;
  --cm-accent: #63C2CE;
  --cm-accent-pressed: #4EACB8;
  --cm-accent-disabled: #355A5E;
  --cm-on-accent: #102326;
  --cm-accent-soft: #203A3D;
  --cm-success: #65C18A;
  --cm-success-soft: #1D3327;
  --cm-warning: #E6B867;
  --cm-warning-soft: #362B18;
  --cm-error: #EE8580;
  --cm-error-soft: #3B2221;
  --cm-border: #F0F3EE17;
  --cm-focus: #63C2CE;
  --cm-focus-ring: #63C2CE4D;
  --cm-scrim: #050908B8;
  --cm-shadow-small: none;
  --cm-shadow-float: 0 12px 28px rgb(0 0 0 / 0.24);
}

html {
  background: var(--cm-page);
  color: var(--cm-text-primary);
  font-family: "Figtree", "PingFang TC", "Noto Sans TC", "Hiragino Sans", system-ui, sans-serif;
  font-synthesis: none;
  -webkit-text-size-adjust: 100%;
}

body {
  min-width: 320px;
  background: var(--cm-page);
  font-size: 15px;
  line-height: 1.6;
}

:lang(zh), :lang(zh-TW), :lang(zh-Hant) {
  font-size: 16px;
  line-height: 1.7;
}

h1, h2, h3, [data-heading] {
  font-feature-settings: "palt" 1;
  letter-spacing: 0;
}

button, [role="button"], input, textarea, select {
  min-height: 44px;
}

button, [role="button"] {
  touch-action: manipulation;
  transition:
    color var(--motion-micro) var(--ease-cm),
    background-color var(--motion-micro) var(--ease-cm),
    border-color var(--motion-micro) var(--ease-cm),
    opacity var(--motion-micro) var(--ease-cm),
    transform var(--motion-micro) var(--ease-cm);
}

button:active:not(:disabled), [role="button"]:active {
  transform: scale(0.98);
}

:focus-visible {
  outline: 2px solid var(--cm-focus);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px var(--cm-focus-ring);
}

.material-symbols-outlined {
  display: inline-block;
  width: 1em;
  height: 1em;
  overflow: hidden;
  font-family: "Material Symbols Outlined";
  font-size: 20px;
  line-height: 1;
  font-weight: normal;
  font-style: normal;
  letter-spacing: normal;
  text-transform: none;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: "liga";
  -webkit-font-smoothing: antialiased;
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" -25, "opsz" 24;
}

@keyframes cm-enter {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Token rules:

- Use 400 for body and 500 for labels/headings. Reserve 600 only for the current English phrase or a primary action. Remove all 700/800/900 weights.
- CJK body is 16/27.2; Latin learning content may be 15/24. Never italicize CJK. English examples use regular weight, not italics.
- Page edge is 16 px at 320–374, 20 px at 375–430. Section gap is 32 px; card gap 12 px; card padding 16 px (20 px only for hero practice cards).
- Hairlines are always `--cm-border`. Do not use 2 px borders except the visible focus ring. Selected state is accent-soft fill plus a 1 px accent border.
- Backgrounds and cards are solid. Never add gradients, glows, glass, colored shadows, or blurred blobs.
- Use `transform: scaleX()` for changing progress bars; do not animate width. Sheets move only with opacity + `translateY(12px)`.

## Shared component specifications

### App bar / header

- Height: 56 px plus `env(safe-area-inset-top)`; surface background; one bottom hairline; no shadow.
- Back button: 44 × 44 hit target, 20 px icon. Title is 17/24, weight 500. Optional second line is 12/16 muted.
- Mobile right side: at most two 44 px controls. Move all other actions to the overflow menu. Do not show “online,” XP, rank, streak, or daily goal badges in a conversation header.
- Overflow menu: 224 px wide, 10 px radius, 8 px vertical padding, floating shadow, 44 px rows.

### Buttons

- **Primary:** 48 px height, 10 px radius, accent fill, on-accent text, 16 px horizontal padding, weight 500. Press uses accent-pressed + scale 0.98. Disabled uses accent-disabled at 55% opacity and no shadow.
- **Secondary:** 48 px, surface-raised fill, 1 px hairline, primary text. Press darkens through `surface-sunken`.
- **Quiet:** 44 px minimum, transparent, accent or secondary text. Underline only for inline links, not button labels.
- Destructive is error fill only inside a confirmation sheet; elsewhere it is error text on a neutral row.
- Never use circular text buttons. Icon-only controls may be 44 × 44 with 10 px radius.

### Cards

- **Base:** surface, 1 px hairline, 14 px radius, 16 px padding, small shadow in light only.
- **Path step:** 64 px minimum. Step number sits outside or overlaps the left margin in a 24 × 24 square (`radius-xs`). Current/next step gets a 3 px accent left rule plus accent-soft background; later steps stay neutral. Never give all three accent borders.
- **Practice hero:** 20 px padding, 14 px radius. One learning prompt is the visual hero. Its English sentence is 21/28 weight 500. Controls follow after 20 px.
- **Review card:** source and instruction are plain 13/20 text; original sentence sits in a sunken field. Correct/wrong is communicated by icon + semantic text + semantic-soft background, never color alone.

### Chips

- **Pattern chips:** content-sized, maximum two lines, 6 px radius, surface-raised, 1 px hairline, 6 px vertical / 8 px horizontal, 13/20 weight 500. No full pills.
- **Mission targets:** same geometry. Unused = neutral; used = success-soft with `check` icon and success text. Do not animate a pop.
- Status/count chips use plain meta text; do not put every count in a capsule.

### Chat bubbles

- Max width 82% at 320 px and 78% from 390 px upward. Gap between turns 20 px.
- Friend bubble: surface, hairline, 14 px radius with 6 px bottom-left. User bubble: accent-soft, no border, 14 px radius with 6 px bottom-right; primary ink, not white-on-bright-blue.
- Friend name is 12/16 muted. User has no “You” label and no user avatar; alignment already communicates authorship.
- Hidden-text voice state uses three opaque neutral text bars and the label “先聽，再看文字 / Listen first, then show text.” Never blur readable text.
- Tappable words gain a subtle underline on press/focus only. Highlighted connectors use a 2 px bottom rule, not a filled mark.

### Input bar

- Sticky bottom surface, top hairline, 12 px top and `max(12px, env(safe-area-inset-bottom))` bottom.
- Textarea is 48 px minimum, 10 px radius, surface-sunken, 1 px hairline, 16 px type, expands to 120 px.
- Mic and send are 48 × 48 with 10 px radius, not circles. Listening is error-soft + error icon/text, static—no pulse. Send is primary; disabled uses accent-disabled.
- Voice-mode entry is a 44 px quiet row above the composer, not a floating pill.

### Bottom sheets

- Mobile: bottom aligned, 24 px top radii, maximum 88dvh, 20 px side / 24 px bottom padding plus safe area. Desktop/tablet: 520 px centered panel with 20 px radius.
- Scrim uses `--cm-scrim`; no backdrop blur. Add a 36 × 4 px drag handle only if the sheet is actually draggable; otherwise omit it.
- Header always includes title, one-sentence description, and 44 px close control. Primary action remains visible at the bottom for long sheets.
- **Summary:** metric line first, target list second, corrections third; hints precede revealed answers.
- **Word popup:** implement as a bottom sheet on phones, not a pointer-positioned popover. Word, optional translation field, saved context, Save/Remove action.

### Voice bar

- Replaces the input bar. Status sentence is the hero: “換你說了 / Your turn.” Center control is 64 × 64, but the surrounding replay/text actions remain 44 × 44.
- “我還在想” is a 44 px secondary button. Pause duration, slower speech, and return-to-typing are a single metadata row beneath.
- Live listening uses a static 8 px error dot plus text. No pulse, glow, or moving waveform.

### Progress and rating

- Progress track: 4 px high, surface-raised; accent indicator with square-ended start and 2 px radius. Animate `scaleX` over 180 ms only.
- Show `4 / 13` as tabular 12/16 text adjacent to the bar, not a badge.
- Rating buttons are three equal 48 px segmented controls: “還不熟 / 有點印象 / 很熟了” and “Not yet / Familiar / Easy.” Selected state uses accent-soft; no semantic green because it is self-report, not correctness.

### Avatar treatment

- Replace every emoji character avatar with a monogram tile: `E`, `M`, `S`, `J`, `Y`; 32 px in messages, 40 px in headers, 48 px in sheets. Shape is a 10 px rounded square, accent-soft fill, accent text, 1 px accent at 18% border, Figtree 500.
- Add an accessible label with the full friend name. Do not create pseudo-portraits. A future illustrator may replace tiles one-for-one, but implementation must not wait for art.
- Replace flag emoji with language codes (`中文`, `EN`, `日本語`) and level emoji with text (`A1–A2`, `B1–B2`, `C1–C2`).

### Icons

- Keep Material Symbols Outlined because the app already uses it, but self-host it. Default 20 px; compact labels 18 px; hero utility icon 24 px. Weight 400, grade -25, optical size 24, outline only.
- One icon color per component: muted by default, accent for selected action, semantic only for success/warning/error. No emoji, filled icon mix, sparkle, celebration, trophy, flame, or decorative icon tiles.

### Loading, empty, and error states

- **Loading:** static structural skeleton matching actual card/bubble shape. Use accent-soft for the leading line and surface-raised for the rest. No shimmer, spinner-only screen, bounce, breathing, or typing dots. Chat loading reads “Emma 正在回覆 / Emma is replying” beside two static short bars.
- **Empty:** one 48 px line icon inside an accent-soft 64 px tile, a concrete sentence, and one action. Example diary: “還沒有日記 / No diary entries yet” + “寫第一篇 / Write the first entry.”
- **Error:** error-soft card next to the failed content with error icon, plain cause, and 44 px Retry action. Daily limit copy must explicitly say offline practice remains available.

## Screen specifications

### Home

- **Hero:** Step 1, “今日練習 / Today’s practice.” Product title is quiet in the header; do not center a large logo above the route.
- Order stays: header controls → compact progress rail → 今天的路線 / Today’s route (1 practice, 2 task chat, 3 say-it-three-times) → 今日觀點 / Daily opinion → 更多 / More → expanded free chat, mode, language/level, tools, start action.
- Progress rail is one 56 px row: `今天 0 / 10 分`, `連續 4 天`, `中級`; use dividers, not a gradient hero card. Keep rank/XP accessible under Learning analytics in More.
- Path uses a faint vertical hairline through the three square step markers. Step 1 has the margin rule and accent-soft fill. Steps 2–3 are neutral. Pattern chips remain visible on Step 1.
- More is a single disclosure row. Expanded content uses grouped list sections, not a five-card icon grid. Free chat friend selection uses monogram list rows.
- Remove: gradient/glow hero and emoji rank/character (`HomeHero.vue:67-70`, `HomeHero.vue:142-153`); gradient path cards and hover scaling (`DailyPracticeCard.vue:29-32`, `TaskChatCard.vue:28-31`); gradient mode cards, emoji avatars/flags, multicolor tool icons, and `transition-all` (`SetupScreen.vue:321-327`, `SetupScreen.vue:345-370`, `SetupScreen.vue:397-399`, `SetupScreen.vue:486-487`, `SetupScreen.vue:556-590`).
- Copy: `和AI朋友一起練習英文` → `把看得懂的英文，練成說得出口` / `Turn the English you know into English you can say`; `開始累積連續天數吧` → `今天先開口 10 分鐘` / `Speak for 10 minutes today`; `更多（自由聊天、學習、日記…）` → `更多練習` / `More practice`. Remove greeting copy and every exclamation mark.

### Daily practice

- **Hero:** the current retrieval task card. Header, level segmented control, and a 4 px progress bar stay fixed; content scrolls.
- Level control is rectangular segmented control (10 px radius), not three pills. Do not change level mid-answer without confirmation.
- Queue stays exactly: mistakes → patterns → words → saved words → listening. Only one queue item appears at a time in production.
- Mistake card: source line, prompt, original sentence, editable attempt, primary “對答案 / Check,” secondary hint. Revealed correction uses success-soft for matching words and error-soft strikeout for changed words.
- Pattern card: English pattern as 21/28 hero, meaning, use case, examples, mistake note, quiz, own-sentence field, rating. Word card: word, pronunciation, meaning, example, collocations, quiz, rating.
- Saved word: recall prompt precedes reveal. Listening: 48 px Play as primary and Slow as secondary; answers are full-width radio rows. Dictation uses the same field style as mistake review.
- Done state uses outlined `task_alt`, not confetti; show summary, today’s patterns, then primary task-chat action.
- Remove uppercase tracked labels and emoji (`DailyPracticeScreen.vue:244`, `DailyPracticeScreen.vue:266-279`, `DailyPracticeScreen.vue:379-380`); animated-width progress (`DailyPracticeScreen.vue:235-236`); lightbulb emoji (`MistakeCard.vue:54`); heavy shadows and mixed green/red borders as the only signal (`MistakeCard.vue:40-84`, `ListeningCard.vue:45-109`).
- Copy: `改改看` → `再改一次` / `Try the sentence again`; `對！這句最自然。` → `這句較自然` / `This is the more natural sentence`; `差一點，原因是：` → `看看差在哪裡` / `See what changed`; `今天練完了！` → `今天的練習完成` / `Today’s practice is complete`; `完全正確！` → `和建議寫法一致` / `Matches the suggested sentence`.

### Chat: free, task, opinion, article, voice

- **Hero:** the conversation itself. Header chrome is quiet; task/opinion context is one sticky strip directly under it.
- Header contains back, monogram, friend name + level, and overflow. Remove goal ring/rank from chat header; they distract from speaking.
- Task mode mission strip: one sentence goal, `1 / 3`, then target chips. It may collapse to a 56 px summary after the user scrolls down; tapping expands. “看小結 / Summary” is enabled after one user turn.
- Free mode shows the daily prompt once inside the message stream. Opinion mode uses the same mission strip with topic + connectors; do not create a second colored topic bar. Article mode opens the article as a full-height sheet on phones, with “文章 / Article” in overflow; tablet may use split view.
- Bubbles follow the shared spec. Keep word tap/save and message feedback. Connector highlight is an underline. Vocabulary hints are a horizontally scrollable quiet row immediately above the input.
- Voice mode replaces input and hides new friend text with structural bars. Preserve replay, slower, show text, “I’m still thinking,” pause duration, and return-to-typing.
- Remove emoji avatars/user avatar (`ChatMessage.vue:101-103`, `ChatMessage.vue:151-153`, `ChatHeader.vue:58-60`); blue user bubble shadow (`ChatMessage.vue:122`); uppercase topic label (`ChatScreen.vue:570`); animated chip pop (`ConnectorMissionBar.vue:98-107`); pulsing/glowing mic (`ChatInput.vue:142-155`, `VoiceConversationBar.vue:169-174`); bouncing/breathing typing state and gradients (`TypingIndicator.vue:25-27`, `TypingIndicator.vue:50-67`); gradient memory toast (`ChatScreen.vue:786`).
- Copy: `在線上 / Online` is removed; `試試用` → `可用句型` / `Patterns you can use`; `仔細聽……` → `Emma 正在說` / `Emma is speaking`; `朋友在想……` → `Emma 正在回覆` / `Emma is replying`; error `嗯，出了點問題。我們再試一次？` → `訊息沒有送出` / `Message wasn’t sent` with `再試一次 / Retry`.

### Task summary sheet

- **Hero:** `2 / 3 個句型用到了 / 2 of 3 patterns used` in 28/36 tabular text. Monogram and title stay secondary.
- Used and missed patterns share one list; success icon or empty square conveys status. Correction cards reveal hint first, answer second. Saved-for-review note follows corrections.
- Loading uses static summary skeleton. Failure stays inside the corrections section with Retry. Keep “繼續聊 / Keep chatting” secondary and “回首頁 / Home” primary in a sticky bottom action row.
- Remove emoji avatar and hint (`ChatSummaryPanel.vue:55-56`, `ChatSummaryPanel.vue:101`), semantic color floods on every row (`ChatSummaryPanel.vue:75-106`), and oversized floating shadow (`ChatSummaryPanel.vue:53`).
- Copy: `聊天小結` → unchanged / `Chat summary`; `{name} 幫你整理了這次聊天` → `這次對話的句型與修改` / `Patterns and edits from this chat`; `可以更好的地方` → `下次可以這樣說` / `Try this next time`; `這次幾乎沒有要改的，很棒！` → `這次沒有需要修改的句子` / `No sentences need changes this time`.

### Retell

- **Hero:** today’s topic. Under it, show the drill sequence as one line: `準備 30 秒 → 90 秒 → 60 秒 → 45 秒`.
- Planning: countdown is the largest figure; notes field below; Ready primary. Round: countdown + static listening status + transcript field + Finish. Between rounds: WPM figure, prior duration, next duration. Results: one bar comparison, transcripts disclosure, Again/Home.
- Use `transform: scaleX()` for countdown and result bars. A static dot indicates listening; no pulse.
- Remove animated width and listening pulse (`RetellScreen.vue:212-225`), bold-heavy statistic hierarchy (`RetellScreen.vue:194-210`, `RetellScreen.vue:242-265`).
- Copy: `越講越順的流暢度練習` → `同一個想法，逐次說得更順` / `Say the same idea more smoothly each round`; `越講越順了！` → `第三次更順` / `The third round was smoother`; `同一件事講了三次，做得好！` → `三次都完成了` / `All three rounds complete`.

### Diary: editor, feedback, history

- **Hero:** the writing field in editor; friend feedback in result; contribution grid in history. Never show three competing hero cards.
- Editor order remains prompt → textarea → count/progress → mic + feedback CTA. Prompt is a 48 px quiet strip, not a blue card. The textarea uses a subtle left notebook rule when focused.
- Feedback order stays reaction → what worked → corrections → better expressions → vocabulary → rewrite → score bars. Use collapsible sections after the reaction; keep corrections expanded when present. Scores remain at the bottom and visually quiet.
- History order stays grid → totals/export → list/calendar toggle → entries. Entry rows are 72 px grouped-list rows; only the selected entry becomes a card. Empty state follows shared spec.
- Remove emoji avatar and animated shimmer/breathe skeleton (`DiaryFeedback.vue:90-91`, `DiaryFeedback.vue:366-396`); uppercase tracked labels and sparkle icon (`DiaryFeedback.vue:157-181`, `DiaryFeedback.vue:233-259`); gradient encouragement (`DiaryFeedback.vue:294-298`); pulsing mic/spinner-only loading and large button shadow (`DiaryEditor.vue:269-283`); gradient feedback reference card (`DiaryScreen.vue:313`, visually treat as neutral).
- Copy: `取得回饋` → `請 Emma 看看` / `Ask Emma for feedback`; `做得不錯` headings → `保留這些寫法` / `Keep these parts`; `可以試試看` → `下次可以這樣寫` / `Try this next time`; `Saved!` → `已匯出` / `Exported`. Remove exclamation marks from feedback headings and generated UI wrappers; do not rewrite user or AI content.

### Daily opinion

- **Hero:** today’s English question, with the Traditional Chinese gloss directly below.
- Three-step scaffold becomes one horizontal stepper (`看法 / 理由 / 收尾`) with short helper copy underneath, not three equal cards. Tapping a step inserts its starter as today.
- Target connectors are two pattern chips. Textarea is the second-largest element. Live connector preview appears only after a connector is detected. Submit stays sticky at bottom.
- Result preserves highlighted answer, connectors, three-part structure, save-a-sentence, AI feedback, rewrite, and completion. Use one summary card, not multiple colored panels.
- Remove uppercase tracked labels, italic CJK/English helper styling, and repeated semantic card fills (`DailyOpinionScreen.vue:277-305`, `DailyOpinionScreen.vue:311-332`, `DailyOpinionScreen.vue:353-363`, `DailyOpinionScreen.vue:388-435`); pulsing mic/spinner and button scaling (`DailyOpinionScreen.vue:521-535`); gradient Home card (`DailyOpinionCard.vue:27-30`).
- Copy: `今日觀點（3 分鐘）` → `用三句話說看法` / `Give your view in three sentences`; `傳給朋友看` → `請 Emma 看看` / `Ask Emma for feedback`; `讚！今天 {a} 和 {b} 都用上了。` → `今天用了 {a} 和 {b}` / `You used {a} and {b}`; `完成，明天見` → `完成` / `Done`.

### Learning hub and modes

- **Hero:** chapter title when inside a chapter; the first due review row on the hub. Do not make every chapter a large card.
- Hub order stays foundation → lock divider → due review → chapters → empty state. Use grouped rows with 56 px number/icon column, title, progress metadata, due count, chevron. Replace YAML emoji chapter icons with mapped Material Symbols by category; unknown category uses `menu_book`.
- Header retains back, speed, bilingual, level. At 320 px, speed and bilingual move into overflow so the title remains visible.
- Mode selector is horizontally scrollable rectangular tabs, 44 px high. Preserve pre-lesson cards/grid/match/quiz/tones and regular list/flashcard/quiz/conversation.
- Vocabulary list card: word is hero, audio controls are quiet. Flashcard: one surface with front/back, no 3D spin; crossfade + translate 8 px. Quiz: progress, prompt, four answer rows, explanation. Conversation practice: dialogue rows with one active accent rule; no emoji speech bubbles.
- Remove gradients, violet foundation theme, emoji review/chapter icons, hover scaling, and pill badges (`LearningScreen.vue:331-382`, `LearningScreen.vue:397-415`, `LearningScreen.vue:418-501`); gradient empty tile (`LearningScreen.vue:505-518`); emoji conversation modal (`LearningScreen.vue:723-745`); pulsing audio buttons and emoji tips (`VocabularyCard.vue:123-224`, `ConversationPractice.vue:174-312`); violet/amber result panels and emoji celebrations (`CharacterMatchGame.vue:196-313`, `TonePractice.vue:214-343`).
- Copy: `選擇章節` → `學習內容` / `Learning`; `每日複習` → `今天到期的複習` / `Due today`; `恭喜` or celebratory result wrappers → factual `測驗完成` / `Quiz complete`; keep lesson content unchanged.

### Settings

- **Hero:** none; this is native-feeling utility UI. Use iOS grouped-list structure on page background.
- Order stays language → appearance → daily goal → voice → data → about. Section labels are 13/20 sentence case, not uppercase. Rows are 52–56 px.
- Language rows use text codes, not flags. Dark mode uses a 48 × 28 switch. Goal and voice choices are segmented controls within one row. Data actions remain grouped; destructive row is error text. Confirmation uses bottom sheet on phone.
- Remove uppercase tracked headings and emoji flags (`SettingsScreen.vue:108-121`, `SettingsScreen.vue:127-221`), 2 px selected borders and `transition-all` (`SettingsScreen.vue:157-182`), heavy modal shadow (`SettingsScreen.vue:234`).
- Copy: `你的母語` → `介面語言` / `Interface language`; `清除所有紀錄` → `清除本機學習紀錄` / `Clear learning data on this device`; `陪你練英文的 AI 朋友` → `英文口說練習` / `English speaking practice`; `已儲存！` → `已匯出` / `Exported`.

### Placement test

- **Hero:** the question sentence. App bar + `第 2 / 10 題` + 4 px progress, then vertically centered prompt and answer rows.
- Answer rows are 56 px minimum with A/B/C/D markers and selected/correct/wrong icon + semantic text. Keep current automatic 600 ms advance, but honor reduced motion and announce the result through an ARIA live region.
- Result shows recommended level as the 28/36 figure, score as secondary metadata, Retake secondary, Apply level primary. Do not use a trophy.
- Remove trophy icon, double accent border, bold-heavy result (`PlacementTestScreen.vue:80-94`); animated width (`PlacementTestScreen.vue:107-108`); 2 px answer borders and `transition-all` (`PlacementTestScreen.vue:118-130`).
- Copy: `等級測試` → unchanged / `Placement test`; `測試結果` → `建議程度` / `Recommended level`; `開始聊天` result CTA → `使用這個程度` / `Use this level`.

### Welcome onboarding

- **Hero:** one simple inline SVG diagram per page: message exchange, remembered note, level path. Use accent line art only; no emoji or generated imagery.
- Full-screen paged flow on phones, not a centered modal. Safe-area app background, illustration in upper 42%, copy below, actions pinned above home indicator. Keep three slides and the final placement/skip choice.
- Page indicator is `1 / 3` text plus a 4 px progress bar; no animated dots. One 360 ms fade-and-rise when the page changes; reduced motion swaps instantly.
- Remove emoji, gradient hero, backdrop blur, overshoot animation, and heavy modal shadow (`WelcomeOnboarding.vue:13-28`, `WelcomeOnboarding.vue:57-61`, `WelcomeOnboarding.vue:120-145`).
- Copy: `學英文，就像跟朋友傳訊息` → `先把英文說出來` / `Start by saying it`; body → `每天照著一條短路線，先複習，再把句型用進對話。` / `Follow one short daily route: review, then use the patterns in a conversation.` Second: `朋友會記得你說過的事` / `Your friend remembers what you share`. Third: `從適合的程度開始` / `Start at the right level`. Keep “做 2 分鐘的等級測試 / Take the 2-minute placement test” and “我自己選程度 / I’ll choose my level.”

## Motion behavior

- One optional entrance per screen: hero + first five supporting items fade/rise 8 px, 50 ms stagger, 360 ms. Do not animate subsequent scroll content.
- Press: 140 ms scale 0.98. Menu/sheet: 280 ms fade + translate. Correct/wrong selection: 180 ms color/border only.
- No loops. Remove pulses, bounce, shimmer, breathing, rotating spinners, confetti, and `transition-all`. A pending request uses a static skeleton plus text.
- Cancel TTS/listening and any active animations on unmount. `prefers-reduced-motion` receives the final state without stagger or transform.

## Implementation order

1. Vendor Figtree and Material Symbols; install the token block; map old utility aliases to the new semantic colors temporarily.
2. Build primitives: `CmAvatar`, `CmIconButton`, three button variants, `CmCard`, `CmChip`, `CmProgress`, `CmAppBar`, `CmSegmentedControl`, `CmStateBlock`, `CmBottomSheet`.
3. Replace emoji/flags/level icons and remove all gradients, glows, colored shadows, loops, uppercase tracking, and `transition-all` globally.
4. Rebuild Home and its three path cards; then Daily practice cards and shared rating/progress.
5. Rebuild chat header, mission strip, message bubbles, composer, voice bar, word sheet, and summary sheet.
6. Apply the system to Retell, Diary, Daily opinion, Learning modes, Settings, Placement, and Welcome in that order.
7. Update zh-TW and English copy exactly as specified; leave learning content and user/AI-generated sentences untouched.
8. Validate at 320, 375, 390, and 430 px in light/dark and zh/en; then test Dynamic Type/text zoom to 120%, keyboard open, safe areas, offline, reduced motion, and VoiceOver labels.

## Implementer checklist

- [ ] All original routes, actions, data, content sections, and Home section order remain.
- [ ] Home’s primary path is practice → task chat → say-it-three-times; everything else remains under More.
- [ ] Light and dark use the exact curated variables above; no hardcoded Slate/Blue/Amber utilities remain in components.
- [ ] Figtree and Material Symbols are self-hosted and available offline; CJK resolves to PingFang TC/Noto Sans TC.
- [ ] No emoji, flag emoji, gradients, glows, blobs, backdrop blur, colored shadows, confetti, or sparkle icons remain.
- [ ] Text uses only the defined scale and weights 400/500/600; no uppercase tracked labels or italic CJK.
- [ ] Every tappable target is at least 44 × 44 with semantic role, visible focus, accessible name, and pressed state.
- [ ] Cards use 1 px hairlines and nested radii; selected state is accent-soft, not a 2 px neon border.
- [ ] Correct, warning, and wrong states include icon/text in addition to color and meet contrast in both themes.
- [ ] All progress changes use transform, not animated width; no `transition-all` or looping animation remains.
- [ ] Loading is structural and static; empty states have icon/message/action; errors sit beside the failed action with Retry.
- [ ] Bottom fixed UI respects `env(safe-area-inset-bottom)` and the on-screen keyboard.
- [ ] Chat voice mode preserves Replay, Slower, Show text, I’m still thinking, pause duration, and return-to-typing.
- [ ] Word save is a bottom sheet on phones; task summary preserves hint-first reveal and review saving.
- [ ] Learning preserves every regular and pre-lesson mode; article discussion, free chat, opinion chat, diary feedback/history, analytics, quests, scenarios, share, import/export, and placement remain reachable.
- [ ] Screens pass at 320 px without horizontal overflow and at 120% text zoom without clipped labels.
- [ ] Final visual test: without the Chat Mate title, the route, notebook margin marks, English pattern chips, and friend conversation still make the product identifiable as a speaking-practice app.
