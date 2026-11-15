# Vietninie – React + Vite

```
npm install
cp .env.example .env   # điền VITE_API_BASE_URL (và Turso nếu dùng)
npm run dev
```
Cấu trúc: `src/components` (common, layout, modals, home, vocabulary, quiz, grammar, listening, specialized, progress, settings), `src/pages`, `src/context`, `src/hooks`, `src/services`, `src/data`, `src/i18n`.
Router dùng HashRouter nên mở được cả khi deploy tĩnh.
