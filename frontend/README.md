# Frontend — Modular React Architecture (Vite + TypeScript)

Accessible, modular React 18+ application consuming the Onion Architecture FastAPI Calculator backend.

---

## 🧩 Component Architecture

```
src/
├── components/
│   ├── Calculator.tsx       # Main orchestrator (handles keypad vs form modes & API errors)
│   ├── Display.tsx          # Accessible screen showing expression, value & loading state
│   ├── Keypad.tsx           # Accessible grid of digits, functions, and operations
│   ├── DirectInputForm.tsx  # Direct numerical inputs for academic testing
│   ├── ErrorBanner.tsx      # Structured alert rendering 400 Bad Request messages
│   └── HistoryList.tsx      # In-memory audit log of prior calculations
├── services/
│   └── calculatorApi.ts     # Strongly-typed fetch client with custom CalculatorApiError
├── types/
│   └── calculator.ts        # TypeScript interfaces matching backend DTO contracts
├── App.tsx                  # Application shell and architectural diagrams
├── main.tsx                 # React DOM mount point
└── index.css                # Polished design system with CSS custom properties
```

---

## 🛡️ Error Handling Philosophy

When the user attempts a domain-violating operation (such as dividing by zero):
1. The backend throws `DivisionByZeroError` in the domain.
2. The FastAPI infrastructure layer catches it and sends:
   ```json
   {
     "error": "BAD_REQUEST",
     "message": "Cannot divide by zero",
     "timestamp": "2026-11-13T13:30:00Z"
   }
   ```
3. `calculatorApi.ts` extracts the payload into a strongly-typed `CalculatorApiError`.
4. `Calculator.tsx` sets the error state.
5. `ErrorBanner.tsx` displays the message and timestamp with high visual contrast.
6. The UI remains fully functional and resilient without crashing.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run Frontend Tests
```bash
npm test
```
Runs Vitest unit and integration component tests.
