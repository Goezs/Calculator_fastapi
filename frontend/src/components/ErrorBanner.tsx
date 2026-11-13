import React from 'react';
import { ApiErrorResponse } from '../types/calculator';

interface ErrorBannerProps {
  error: ApiErrorResponse | null;
  onDismiss: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ error, onDismiss }) => {
  if (!error) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="error-banner"
      data-testid="error-banner"
    >
      <div className="error-banner-header">
        <div className="error-banner-title">
          <svg
            className="error-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span className="error-badge">{error.error || 'BAD_REQUEST'}</span>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="error-dismiss-btn"
          aria-label="Dismiss error banner"
        >
          ×
        </button>
      </div>

      <div className="error-banner-body">
        <p className="error-message" data-testid="error-message">
          {error.message}
        </p>
        {error.timestamp && (
          <span className="error-timestamp">
            Timestamp: {error.timestamp}
          </span>
        )}
      </div>
    </div>
  );
};
