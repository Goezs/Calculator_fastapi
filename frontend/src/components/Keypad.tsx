import React from 'react';
import { OperationType } from '../types/calculator';

interface KeypadProps {
  onDigit: (digit: string) => void;
  onDecimal: () => void;
  onOperation: (op: OperationType) => void;
  onEquals: () => void;
  onClear: () => void;
  onBackspace: () => void;
  onToggleSign: () => void;
  selectedOperation: OperationType | null;
  disabled?: boolean;
}

export const Keypad: React.FC<KeypadProps> = ({
  onDigit,
  onDecimal,
  onOperation,
  onEquals,
  onClear,
  onBackspace,
  onToggleSign,
  selectedOperation,
  disabled = false,
}) => {
  return (
    <div className="calculator-keypad" role="group" aria-label="Calculator Keypad">
      {/* Row 1 */}
      <button
        type="button"
        className="key-btn key-function"
        onClick={onClear}
        disabled={disabled}
        data-testid="btn-clear"
        aria-label="All clear"
      >
        AC
      </button>
      <button
        type="button"
        className="key-btn key-function"
        onClick={onBackspace}
        disabled={disabled}
        data-testid="btn-backspace"
        aria-label="Backspace"
      >
        ⌫
      </button>
      <button
        type="button"
        className="key-btn key-function"
        onClick={onToggleSign}
        disabled={disabled}
        data-testid="btn-toggle-sign"
        aria-label="Change sign"
      >
        ±
      </button>
      <button
        type="button"
        className={`key-btn key-operator ${selectedOperation === 'DIVISION' ? 'active-op' : ''}`}
        onClick={() => onOperation('DIVISION')}
        disabled={disabled}
        data-testid="btn-op-divide"
        aria-label="Divide"
      >
        ÷
      </button>

      {/* Row 2 */}
      <button
        type="button"
        className="key-btn key-digit"
        onClick={() => onDigit('7')}
        disabled={disabled}
        data-testid="btn-digit-7"
      >
        7
      </button>
      <button
        type="button"
        className="key-btn key-digit"
        onClick={() => onDigit('8')}
        disabled={disabled}
        data-testid="btn-digit-8"
      >
        8
      </button>
      <button
        type="button"
        className="key-btn key-digit"
        onClick={() => onDigit('9')}
        disabled={disabled}
        data-testid="btn-digit-9"
      >
        9
      </button>
      <button
        type="button"
        className={`key-btn key-operator ${selectedOperation === 'MULTIPLICATION' ? 'active-op' : ''}`}
        onClick={() => onOperation('MULTIPLICATION')}
        disabled={disabled}
        data-testid="btn-op-multiply"
        aria-label="Multiply"
      >
        ×
      </button>

      {/* Row 3 */}
      <button
        type="button"
        className="key-btn key-digit"
        onClick={() => onDigit('4')}
        disabled={disabled}
        data-testid="btn-digit-4"
      >
        4
      </button>
      <button
        type="button"
        className="key-btn key-digit"
        onClick={() => onDigit('5')}
        disabled={disabled}
        data-testid="btn-digit-5"
      >
        5
      </button>
      <button
        type="button"
        className="key-btn key-digit"
        onClick={() => onDigit('6')}
        disabled={disabled}
        data-testid="btn-digit-6"
      >
        6
      </button>
      <button
        type="button"
        className={`key-btn key-operator ${selectedOperation === 'SUBTRACTION' ? 'active-op' : ''}`}
        onClick={() => onOperation('SUBTRACTION')}
        disabled={disabled}
        data-testid="btn-op-subtract"
        aria-label="Subtract"
      >
        −
      </button>

      {/* Row 4 */}
      <button
        type="button"
        className="key-btn key-digit"
        onClick={() => onDigit('1')}
        disabled={disabled}
        data-testid="btn-digit-1"
      >
        1
      </button>
      <button
        type="button"
        className="key-btn key-digit"
        onClick={() => onDigit('2')}
        disabled={disabled}
        data-testid="btn-digit-2"
      >
        2
      </button>
      <button
        type="button"
        className="key-btn key-digit"
        onClick={() => onDigit('3')}
        disabled={disabled}
        data-testid="btn-digit-3"
      >
        3
      </button>
      <button
        type="button"
        className={`key-btn key-operator ${selectedOperation === 'ADDITION' ? 'active-op' : ''}`}
        onClick={() => onOperation('ADDITION')}
        disabled={disabled}
        data-testid="btn-op-add"
        aria-label="Add"
      >
        +
      </button>

      {/* Row 5 */}
      <button
        type="button"
        className="key-btn key-digit key-zero"
        onClick={() => onDigit('0')}
        disabled={disabled}
        data-testid="btn-digit-0"
      >
        0
      </button>
      <button
        type="button"
        className="key-btn key-digit"
        onClick={onDecimal}
        disabled={disabled}
        data-testid="btn-decimal"
        aria-label="Decimal point"
      >
        .
      </button>
      <button
        type="button"
        className="key-btn key-equals"
        onClick={onEquals}
        disabled={disabled}
        data-testid="btn-equals"
        aria-label="Calculate equals"
      >
        =
      </button>
    </div>
  );
};
