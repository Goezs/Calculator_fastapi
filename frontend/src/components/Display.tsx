import React from 'react';

interface DisplayProps {
  expression: string;
  value: string;
  isLoading: boolean;
}

export const Display: React.FC<DisplayProps> = ({ expression, value, isLoading }) => {
  return (
    <div className="calculator-display" aria-live="polite">
      <div className="display-expression" data-testid="display-expression">
        {expression || '\u00A0'}
      </div>
      <div className="display-main">
        {isLoading && (
          <span className="display-loading-indicator" aria-label="Calculating...">
            <svg
              className="spinner-icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
        )}
        <div
          className="display-value"
          data-testid="display-value"
          title={value}
        >
          {value}
        </div>
      </div>
    </div>
  );
};
