# Copilot Instructions for Al-Ahzar_Front

## Project Overview
- **Framework:** Next.js (App Router)
- **UI Library:** Chakra UI
- **Internationalization:** next-intl (translation keys in `messages/`)
- **Custom Layouts:** DataTableLayout for responsive tables
- **API Integration:** Custom API handlers in `src/lib/services/`

## Coding Conventions
- **Internationalization:**
  - All user-facing text must use translation keys via `useTranslations` from next-intl.
  - Translation files: `messages/en.json`, `messages/fr.json`, `messages/ar.json`.
  - Use descriptive, nested keys (e.g., `dashboard.title`, `form.submit`).
- **UI Components:**
  - Use Chakra UI components for all UI. Theme is defined in `src/theme.js`.
  - For horizontal alignment, use `HStack` (not `Wrap`).
  - For responsive tables, use `DataTableLayout`.
- **Forms:**
  - Use translation keys for all labels, placeholders, and validation messages.
  - Place form logic in `src/components/forms/`.
- **API Calls:**
  - Use service files in `src/lib/services/` for all API interactions.
  - Use async/await and handle errors gracefully.
- **File Structure:**
  - Pages: `src/pages/`
  - Components: `src/components/`
  - Utilities: `src/lib/utils/`
  - Theme: `src/theme.js`

## Best Practices
- Do not hardcode any user-facing strings; always use translation keys.
- Use Chakra UI's responsive props for mobile-first design.
- Comment code clearly, especially for complex logic.
- Keep components small and focused; use composition.
- Use Chakra UI's responsive props for mobile-first design.
- Avoid importing Chakra UI theme on the server side.
- Use mappers in `src/lib/utils/mappers/` for transforming API data for tables/forms.

## AI Agent Guidance
- When generating new code, always:
  - Use translation keys for all text.
  - Use Chakra UI components and follow the theme.
  - Place new files in the correct directory according to the structure above.
  - Follow the async/await pattern for API calls.
  - Reference and reuse existing mappers/utilities where possible.
- When updating code, refactor hardcoded strings to use translation keys.
- For new data tables, use `DataTableLayout` and ensure mobile responsiveness.
- For new forms, follow the structure in `src/components/forms/` and use translation keys for all UI text.

## References
- [README.md](../README.md)
- [contributing.md](../contributing.md)
- [src/theme.js](../src/theme.js)
- [messages/en.json, fr.json, ar.json](../messages/)
- [src/lib/services/](../src/lib/services/)
- [src/lib/utils/mappers/](../src/lib/utils/mappers/)

---

*Last updated: 2024-06*
