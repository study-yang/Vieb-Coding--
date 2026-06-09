# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"快记" (Quick Jot) — an AI-powered expense tracking WeChat Mini Program built on Tencent CloudBase. Supports manual entry, voice input, photo receipt scanning, AI analysis, and budget management. Login-free: users are identified by WeChat OPENID automatically in cloud functions.

## Repository Layout

```
miniprogram/            → WeChat Mini Program frontend
  pages/                → 5 tab pages: index (记账), bill-list (账单), ai-analysis (分析), budget, profile
  components/           → 7 reusable components (bill-card, category-picker, number-keyboard, voice-input, etc.)
  utils/                → api.js (CloudBase call wrapper), categories.js, format.js, storage.js
  mixins/               → budget-checker.js (Behavior reused across pages)
  app-config.js         → Category definitions, budget defaults — single source of truth for constants
cloudfunctions/         → 8 Node.js cloud functions (see below)
  shared/categories.js  → Backend copy of category data, shared across AI functions
rules/                  → CloudBase platform skill docs (miniprogram, auth-wechat, ai-model-wechat, etc.)
CODEBUDDY.md            → CloudBase AI Development Rules Guide (authoritative for platform conventions)
```

## Architecture

### Data Flow

```
User Input (manual/voice/photo)
  → miniprogram/utils/api.js  (API.call wraps wx.cloud.callFunction)
    → cloud function (billCRUD / aiParseVoice / aiParseImage)
      → CloudBase NoSQL DB (bills, budgets, users, feedbacks collections)
```

All API calls go through `miniprogram/utils/api.js`, which normalizes the `{ code: 0, data, message }` response convention and handles errors centrally.

### Database Collections

- **bills** — `amount` (positive=expense, negative=income), `category`, `date`, `note`, `source` (manual/voice/image), `imageUrl`, `_openid`
- **budgets** — `type` (day/month), `amount`, `isActive`, `_openid`
- **users** — `nickName`, `avatarUrl`, `_openid`
- **feedbacks** — user feedback submissions

### Cloud Functions

| Function | Type | Purpose |
|---|---|---|
| `billCRUD` | Event | create/update/delete/query/exportAll actions on bills |
| `getStatistics` | Event | Aggregated stats: totals, category breakdown, daily summary (uses aggregate pipeline) |
| `aiParseVoice` | Event | AI parses natural-language text into bill records via Hunyuan model |
| `aiParseImage` | Event | AI parses receipt/photo into bill records |
| `aiAnalyze` | Event | AI generates friendly spending analysis report |
| `aiSuggest` | Event | AI generates spending improvement suggestions |
| `checkBudget` | Event | Compares current spending against active budgets |
| `getUserProfile` | Event | get-or-create user profile, update profile |
| `sendFeedback` | Event | Submit user feedback |
| `voiceToText` | Event | Voice-to-text conversion |

### AI Call Pattern

AI functions use a **dual SDK init**: `wx-server-sdk` for context/OPENID, `@cloudbase/node-sdk` for `app.ai()`. The model group is `"hunyuan-exp"` with model `"hunyuan-2.0-instruct-20251111"`. Responses are streamed via `streamText()` and parsed from JSON with regex fallback.

### Category Data Sync

Category definitions exist in **two places** that must stay in sync:
- Frontend: `miniprogram/app-config.js` → `EXPENSE_CATEGORIES`, `INCOME_CATEGORIES`
- Backend: `cloudfunctions/shared/categories.js` → `CATEGORY_MAP`, `EXPENSE_CATEGORY_NAMES`

### Theme System

Dark mode is supported via `app.applyTheme()` with three modes: `auto` (follows system), `light`, `dark`. Theme is broadcast to all pages via `notifyPages()` which calls `setData()` on each active page. Storage key: `themeMode`.

## Development Commands

- **Open in WeChat DevTools**: The project root is `E:\Vibe Coding\微信小程序-快记` (contains `project.config.json`). Use WeChat Developer Tools to preview, debug, and upload.
- **Cloud function deployment**: Use MCP tools — `manageFunctions(action="createFunction")` or `manageFunctions(action="updateFunctionCode")` with `functionRootPath` pointing to the `cloudfunctions/` directory.
- **No local build/bundler**: This is a native WeChat Mini Program — no webpack/vite. The WeChat DevTools handles ES6→ES5 transpilation and CSS preprocessing.

## Key Conventions

- **Response format**: All cloud functions return `{ code: 0, data, message }`. Code `0` = success.
- **Amount sign convention**: Positive = expense, negative = income (stored in DB). Display layer inverts sign.
- **Error handling**: `API.call()` in `utils/api.js` centralizes toast notifications for non-timeout errors. Individual pages handle timeouts silently.
- **`_openid` isolation**: All DB queries filter by `wxContext.OPENID` to enforce per-user data isolation.
- **Components use `triggerEvent`**: Parent pages listen for `voiceText`, `needManualInput`, `change` events from components.
- **Budget checking mixin**: `mixins/budget-checker.js` is a `Behavior` reused by the index page — it's not a true mixin, just a shared behavior.

## Platform Rules

When implementing features, consult the `rules/` directory for platform-specific guidance:
- `rules/miniprogram-development/rule.md` — Mini Program project structure and wx.cloud usage
- `rules/auth-wechat/rule.md` — Login-free auth, OPENID in cloud functions
- `rules/no-sql-wx-mp-sdk/rule.md` — NoSQL database operations from Mini Program
- `rules/ai-model-wechat/rule.md` — AI model calling patterns for Mini Program
- `rules/cloud-functions/rule.md` — Cloud function development and deployment
- `rules/ui-design/rule.md` — UI design guidelines (read before generating any new UI)

The full CloudBase AI Development Rules Guide is at `CODEBUDDY.md`.
