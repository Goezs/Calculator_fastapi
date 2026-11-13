import React from 'react';
import { Calculator } from './components/Calculator';

export const App: React.FC = () => {
  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="app-header">
        <div className="header-badges">
          <span className="badge badge-primary">FastAPI 0.115+</span>
          <span className="badge badge-secondary">React 18+ Vite</span>
          <span className="badge badge-accent">Strict Onion Architecture</span>
        </div>
        <h1 className="app-title">Academic Full-Stack Calculator</h1>
        <p className="app-subtitle">
          Demonstrating Pure Python Core Domain Services, Application Use Cases & DTOs,
          and FastAPI Infrastructure with Modular React Interface.
        </p>

        {/* Architecture Flow Diagram Indicator */}
        <div className="arch-flow-bar" aria-label="Architecture layers flow">
          <div className="arch-step">
            <span className="arch-step-num">1</span>
            <span className="arch-step-label">Domain Layer (Pure Python)</span>
          </div>
          <span className="arch-arrow">→</span>
          <div className="arch-step">
            <span className="arch-step-num">2</span>
            <span className="arch-step-label">Application Use Cases & DTOs</span>
          </div>
          <span className="arch-arrow">→</span>
          <div className="arch-step">
            <span className="arch-step-num">3</span>
            <span className="arch-step-label">FastAPI Infrastructure & Handlers</span>
          </div>
          <span className="arch-arrow">→</span>
          <div className="arch-step">
            <span className="arch-step-num">4</span>
            <span className="arch-step-label">React UI & API Client</span>
          </div>
        </div>
      </header>

      {/* Main Calculator Body */}
      <main className="main-content">
        <Calculator />
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-col">
            <h4>Backend Specifications</h4>
            <ul>
              <li><strong>Domain:</strong> Pure standard library dataclasses & enums</li>
              <li><strong>Zero Framework Imports:</strong> Domain knows nothing about FastAPI or Pydantic</li>
              <li><strong>Use Cases:</strong> Orchestrates domain execution and DTO mapping</li>
              <li><strong>Exception Handlers:</strong> Maps <code>DivisionByZeroError</code> to <code>400 Bad Request</code></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Frontend Specifications</h4>
            <ul>
              <li><strong>Framework:</strong> React with TypeScript and Vite</li>
              <li><strong>API Client:</strong> Typed async client with <code>CalculatorApiError</code></li>
              <li><strong>Error Boundary:</strong> Gracefully catches and renders error payloads without crashing</li>
              <li><strong>Testing:</strong> Vitest + React Testing Library suite</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© Academic Full-Stack Software Architecture Sample • Clean Architecture / Onion Pattern</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
