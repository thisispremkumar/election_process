# Election Process Assistant 🗳️

An interactive, accessible, and AI-powered educational guide to the Indian election process. Built with modern web technologies and deeply integrated with **Google Cloud** services.

## 🌟 Features

- **Interactive Timeline**: 6-step voter journey from eligibility to casting a vote
- **AI Chat Assistant**: Powered by **Google Cloud Vertex AI (Gemini 1.5 Flash)** with streaming responses
- **Voice Search**: Web Speech API with `en-IN` and `hi-IN` locale support
- **Dynamic Google Maps**: Polling booth locations with markers, InfoWindows, and "Get Directions"
- **Multilingual Support**: Google Translate widget supporting 11 Indian languages
- **Accessibility First**: WCAG 2.1 AA compliant with keyboard navigation, ARIA labels, skip links, and `prefers-reduced-motion`

## 🔧 Google Cloud Services Integrated

| Service | Purpose |
|---|---|
| **Vertex AI (Gemini)** | AI-powered chat responses with streaming & safety filters |
| **Cloud Logging** | Structured logs via Winston + `@google-cloud/logging-winston` |
| **Cloud Profiler** | CPU/heap profiling in production |
| **Cloud Run** | Containerized deployment (Dockerfile included) |
| **Google Maps JS API** | Dynamic maps with markers and directions |
| **Google Analytics 4** | Custom event tracking (6+ event types) |
| **Google Translate** | Multilingual widget for 11 Indian languages |
| **Google reCAPTCHA v3** | Bot protection for chat input |
| **Google Fonts** | Outfit, Inter, and Material Icons |
| **Google Search (JSON-LD)** | FAQPage, BreadcrumbList, EducationalApplication structured data |

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run locally
npm start

# Run tests
npm test
```

## 🐳 Deploy to Google Cloud Run

```bash
# Build and deploy
gcloud run deploy election-process-assistant \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

## 🧪 Testing

```bash
# Run tests with coverage
npm test
```

Test coverage includes:
- API endpoint validation (400, 503, 200 status codes)
- Vertex AI streaming mock with error/timeout scenarios
- XSS injection handling
- Message length validation
- FAQ memoization and debounce logic
- Security header verification (Helmet, CORS)

## 📊 Architecture

```
├── index.html         # Frontend with Google Services (Maps, GA4, Translate, reCAPTCHA)
├── script.js          # Client-side logic with GA4 event tracking
├── styles.css         # Responsive CSS with glassmorphism and a11y support
├── data.js            # Election step data and FAQ database
├── utils.js           # Memoized FAQ search and debounce utility
├── server.js          # Express server with Vertex AI, Helmet, rate limiting
├── server.test.js     # Backend integration tests (26 tests)
├── frontend.test.js   # Frontend unit tests (10 tests)
├── Dockerfile         # Cloud Run container configuration
└── package.json       # Dependencies and scripts
```

## 📝 License

ISC - Created for the PromptWars challenge.
