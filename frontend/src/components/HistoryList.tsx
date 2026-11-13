import React from 'react';
import { CalculationRecord } from '../types/calculator';

interface HistoryListProps {
  history: CalculationRecord[];
  onSelectRecord: (record: CalculationRecord) => void;
  onClearHistory: () => void;
}

const OP_SYMBOLS: Record<string, string> = {
  ADDITION: '+',
  SUBTRACTION: '−',
  MULTIPLICATION: '×',
  DIVISION: '÷',
};

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  onSelectRecord,
  onClearHistory,
}) => {
  return (
    <div className="calculator-history" data-testid="calculator-history">
      <div className="history-header">
        <div className="history-title">
          <svg
            className="history-icon"
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
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <h3>Audit Log & History</h3>
        </div>
        {history.length > 0 && (
          <button
            type="button"
            className="history-clear-btn"
            onClick={onClearHistory}
            data-testid="btn-clear-history"
            aria-label="Clear calculation history"
          >
            Clear
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="history-empty">
          <p>No calculations performed yet.</p>
          <span>Operate using the keypad or API form to view logs.</span>
        </div>
      ) : (
        <ul className="history-items" role="list">
          {history.map((item) => (
            <li
              key={item.id}
              className="history-item"
              onClick={() => onSelectRecord(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectRecord(item);
                }
              }}
              data-testid={`history-item-${item.id}`}
            >
              <div className="history-item-calc">
                <span className="history-operands">
                  {item.operand_a} {OP_SYMBOLS[item.operation] || item.operation} {item.operand_b}
                </span>
                <span className="history-result">= {item.result}</span>
              </div>
              <div className="history-item-meta">
                <span className="history-op-tag">{item.operation}</span>
                <span className="history-time">{new Date(item.timestamp).toLocaleTimeString()}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
