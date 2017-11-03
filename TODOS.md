#### Todos
###### High Priority Features:
- [ ] CAS Login Support

###### Medium Priority Features:

###### Low Priority Features:
- [ ] Styling of the online indicator image
- [ ] Theming of Dialog Modals

###### Done:
- [x] Product Tour
- [x] gzip language files
- [x] Single Quizmaster setting
- [x] Cookie Consent
- [x] Support Api calls of PowerPoint Plugin
- [x] Full Markdown Support for Questions
- [x] Full Markdown Support for Answeroptions
- [x] Toggle for blocking rude nicknames in the Nickname Manager
- [x] Reading Confirmation
- [x] Confidence Rate
- [x] Cache external Resources from Quizzes with activated "Cache Assets" configuration switch
- [x] Voting View
- [x] Export of Results
- [x] Import of Quizzes
- [x] Share the session configuration update to the clients in the Live Results
- [x] ABCD Question
- [x] Client: Translation (DE, FR, ES, IT)
- [x] Server: Translation for Excel export files (EN, DE, FR, ES, IT)
- [x] Server: Caching of previously rendered mathjax
- [x] Mathjax & Markdown in Voting View
- [x] Display of question content in the Live Results
- [x] Support renaming of duplicate quizzes on upload
- [x] Support assets caching when importing quizzes

#### Known issues
- [x] Add translation files for the export files to the messageformat instance
- [x] Order of mathjax output in answeroption live preview currently depends on async rendering race conditions
- [ ] Size of QR Code in the Quiz Lobby too small
- [ ] Adjust some of the introjs initializations
- [ ] Add missing translation keys
- [ ] Fix question handling of quizzes with multiple questions
- [ ] Fix repeated firing reading confirmation request

#### Refactoring required
- [x] MathJax / Markdown parsing in the client (use svg only)
- [ ] Format ABCD Quiz Name depending on the number of answers
- [ ] Reuse existing ABCD Quizzes when adding a new one
- [ ] Move color styles from the components to the theme switcher
- [ ] Remove unused language keys

#### Testing required
- [ ] Export of Results
- [ ] Reading confirmation
- [ ] Confidence grade