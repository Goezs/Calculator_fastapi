import React, { useState } from 'react';
import { CalculateRequest, OperationType } from '../types/calculator';

interface DirectInputFormProps {
  onSubmit: (request: CalculateRequest) => void;
  isLoading: boolean;
  onClear: () => void;
  lastResult: number | null;
}

const OPERATIONS: { type: OperationType; label: string; symbol: string }[] = [
  { type: 'ADDITION', label: 'Addition', symbol: '+' },
  { type: 'SUBTRACTION', label: 'Subtraction', symbol: '−' },
  { type: 'MULTIPLICATION', label: 'Multiplication', symbol: '×' },
  { type: 'DIVISION', label: 'Division', symbol: '÷' },
];

export const DirectInputForm: React.FC<DirectInputFormProps> = ({
  onSubmit,
  isLoading,
  onClear,
  lastResult,
}) => {
  const [operandA, setOperandA] = useState<string>('10');
  const [operandB, setOperandB] = useState<string>('2');
  const [operation, setOperation] = useState<OperationType>('DIVISION');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const a = parseFloat(operandA);
    const b = parseFloat(operandB);

    if (isNaN(a) || isNaN(b)) {
      return;
    }

    onSubmit({
      operand_a: a,
      operand_b: b,
      operation,
    });
  };

  const handleReset = () => {
    setOperandA('');
    setOperandB('');
    onClear();
  };

  return (
    <form className="direct-form" onSubmit={handleSubmit} data-testid="direct-form">
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="operand-a-input">Operand A</label>
          <input
            id="operand-a-input"
            data-testid="input-operand-a"
            type="number"
            step="any"
            required
            value={operandA}
            onChange={(e) => setOperandA(e.target.value)}
            placeholder="e.g. 10.0"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="operation-selector">Operation</label>
          <div className="operation-pill-group" role="radiogroup" aria-label="Arithmetic Operation">
            {OPERATIONS.map((op) => (
              <button
                key={op.type}
                type="button"
                role="radio"
                aria-checked={operation === op.type}
                className={`op-pill-btn ${operation === op.type ? 'active' : ''}`}
                onClick={() => setOperation(op.type)}
                data-testid={`form-op-${op.type.toLowerCase()}`}
              >
                <span className="op-symbol">{op.symbol}</span>
                <span className="op-name">{op.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="operand-b-input">Operand B</label>
          <input
            id="operand-b-input"
            data-testid="input-operand-b"
            type="number"
            step="any"
            required
            value={operandB}
            onChange={(e) => setOperandB(e.target.value)}
            placeholder="e.g. 2.0 (try 0 for error test)"
            className="form-input"
          />
        </div>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn-primary-calc"
          disabled={isLoading || operandA === '' || operandB === ''}
          data-testid="btn-form-submit"
        >
          {isLoading ? 'Computing via FastAPI...' : 'Calculate via API'}
        </button>
        <button
          type="button"
          className="btn-secondary-reset"
          onClick={handleReset}
          disabled={isLoading}
          data-testid="btn-form-clear"
        >
          Reset Form
        </button>
      </div>

      {lastResult !== null && (
        <div className="form-result-box" data-testid="form-result-box">
          <span className="result-label">Computed Result:</span>
          <span className="result-value" data-testid="form-result-value">{lastResult}</span>
        </div>
      )}
    </form>
  );
};
