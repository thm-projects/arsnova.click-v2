#### Todos
###### High Priority Features:
- [ ] CAS Login Support

###### Medium Priority Features:
- [ ] Mathjax & Markdown in Voting View
- [ ] Display of Question content in the Live Results
- [ ] Support renaming of duplicate quizzes on upload

###### Low Priority Features:
- [ ] Client: Translation (DE, FR, ES, IT)
- [ ] Server: Translation for Excel export files (EN, DE, FR, ES, IT)
- [ ] Styling of the online indicator image
- [ ] Theming of Dialog Modals
- [ ] Support Assets Caching when importing quizzes

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

#### Known issues
- [ ] Size of QR Code in the Quiz Lobby too small
- [ ] Order of mathjax output in answeroption live preview currently depends on async rendering race conditions
- [ ] Adjust some of the introjs initializations

#### Refactoring required
- [ ] MathJax / Markdown parsing in the client (use svg only)
- [ ] Format ABCD Quiz Name depending on the number of answers
- [ ] Reuse existing ABCD Quizzes when adding a new one
- [ ] Move color styles from the components to the theme switcher

#### Testing required
- [ ] Export of Results