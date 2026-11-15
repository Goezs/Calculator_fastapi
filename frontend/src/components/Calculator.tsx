import React, { useState } from 'react';
import { calculatorApi, CalculatorApiError } from '../services/calculatorApi';
import { ApiErrorResponse, CalculateRequest, CalculationRecord, OperationType } from '../types/calculator';
import { Display } from './Display';
import { Keypad } from './Keypad';
import { ErrorBanner } from './ErrorBanner';
import { HistoryList } from './HistoryList';
import { DirectInputForm } from './DirectInputForm';

const OP_SYMBOLS: Record<OperationType, string> = {
  ADDITION: '+',
  SUBTRACTION: '−',
  MULTIPLICATION: '×',
  DIVISION: '÷',
};

export const Calculator: React.FC = () => {
  // Mode selection: 'keypad' or 'direct'
  const [activeTab, setActiveTab] = useState<'keypad' | 'direct'>('keypad');

  // Keypad Calculator State
  const [currentInput, setCurrentInput] = useState<string>('0');
  const [previousOperand, setPreviousOperand] = useState<number | null>(null);
  const [activeOperation, setActiveOperation] = useState<OperationType | null>(null);
  const [expressionPreview, setExpressionPreview] = useState<string>('');
  const [shouldResetInput, setShouldResetInput] = useState<boolean>(false);

  // Common UI State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiErrorResponse | null>(null);
  const [lastResult, setLastResult] = useState<number | null>(null);
  const [history, setHistory] = useState<CalculationRecord[]>([]);

  // Execute API Request
  const performCalculation = async (request: CalculateRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await calculatorApi.calculate(request);
      setLastResult(response.result);
      setCurrentInput(String(response.result));
      setExpressionPreview(
        `${response.operand_a} ${OP_SYMBOLS[response.operation]} ${response.operand_b} =`
      );
      setPreviousOperand(null);
      setActiveOperation(null);
      setShouldResetInput(true);

      // Record into in-memory history
      const newRecord: CalculationRecord = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        operand_a: response.operand_a,
        operand_b: response.operand_b,
        operation: response.operation,
        result: response.result,
        timestamp: new Date().toISOString(),
      };
      setHistory((prev) => [newRecord, ...prev]);
    } catch (err: unknown) {
      if (err instanceof CalculatorApiError) {
        setError({
          error: err.error,
          message: err.message,
          timestamp: err.timestamp,
        });
      } else if (err instanceof Error) {
        setError({
          error: 'UNEXPECTED_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        });
      } else {
        setError({
          error: 'UNKNOWN_ERROR',
          message: 'An unexpected error occurred during calculation.',
          timestamp: new Date().toISOString(),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Keypad Handlers
  const handleDigit = (digit: string) => {
    setError(null);
    if (shouldResetInput || currentInput === '0') {
      setCurrentInput(digit);
      setShouldResetInput(false);
    } else {
      setCurrentInput((prev) => prev + digit);
    }
  };

  const handleDecimal = () => {
    setError(null);
    if (shouldResetInput) {
      setCurrentInput('0.');
      setShouldResetInput(false);
    } else if (!currentInput.includes('.')) {
      setCurrentInput((prev) => prev + '.');
    }
  };

  const handleOperationSelect = (operation: OperationType) => {
    setError(null);
    const currentValue = parseFloat(currentInput);

    if (previousOperand !== null && activeOperation !== null && !shouldResetInput) {
      // Chain previous operation first
      performCalculation({
        operand_a: previousOperand,
        operand_b: currentValue,
        operation: activeOperation,
      });
      setPreviousOperand(currentValue);
    } else {
      setPreviousOperand(currentValue);
    }

    setActiveOperation(operation);
    setExpressionPreview(`${currentValue} ${OP_SYMBOLS[operation]}`);
    setShouldResetInput(true);
  };

  const handleEquals = () => {
    if (previousOperand === null || activeOperation === null) {
      return;
    }

    const currentOperandB = parseFloat(currentInput);
    if (isNaN(currentOperandB)) return;

    performCalculation({
      operand_a: previousOperand,
      operand_b: currentOperandB,
      operation: activeOperation,
    });
  };

  const handleClear = () => {
    setCurrentInput('0');
    setPreviousOperand(null);
    setActiveOperation(null);
    setExpressionPreview('');
    setError(null);
    setLastResult(null);
    setShouldResetInput(false);
  };

  const handleBackspace = () => {
    if (shouldResetInput) return;
    if (currentInput.length <= 1) {
      setCurrentInput('0');
    } else {
      setCurrentInput((prev) => prev.slice(0, -1));
    }
  };

  const handleToggleSign = () => {
    const val = parseFloat(currentInput);
    if (val !== 0) {
      setCurrentInput(String(-val));
    }
  };

  const handleSelectRecord = (record: CalculationRecord) => {
    setCurrentInput(String(record.result));
    setExpressionPreview(`${record.operand_a} ${OP_SYMBOLS[record.operation]} ${record.operand_b} =`);
    setPreviousOperand(null);
    setActiveOperation(null);
    setShouldResetInput(true);
    setError(null);
  };

  return (
    <div className="calculator-wrapper">
      {/* Top Banner Navigation & Mode Switcher */}
      <div className="calculator-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'keypad'}
          className={`tab-btn ${activeTab === 'keypad' ? 'active' : ''}`}
          onClick={() => setActiveTab('keypad')}
          data-testid="tab-keypad"
        >
          Keypad Mode
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'direct'}
          className={`tab-btn ${activeTab === 'direct' ? 'active' : ''}`}
          onClick={() => setActiveTab('direct')}
          data-testid="tab-direct"
        >
          Direct Inputs (API Form)
        </button>
      </div>

      {/* Global Error Banner */}
      <ErrorBanner error={error} onDismiss={() => setError(null)} />

      <div className="calculator-layout">
        <div className="calculator-card">
          {activeTab === 'keypad' ? (
            <>
              <Display
                expression={expressionPreview}
                value={currentInput}
                isLoading={isLoading}
              />
              <Keypad
                onDigit={handleDigit}
                onDecimal={handleDecimal}
                onOperation={handleOperationSelect}
                onEquals={handleEquals}
                onClear={handleClear}
                onBackspace={handleBackspace}
                onToggleSign={handleToggleSign}
                selectedOperation={activeOperation}
                disabled={isLoading}
              />
            </>
          ) : (
            <DirectInputForm
              onSubmit={performCalculation}
              isLoading={isLoading}
              onClear={handleClear}
              lastResult={lastResult}
            />
          )}
        </div>

        {/* History Audit Column */}
        <HistoryList
          history={history}
          onSelectRecord={handleSelectRecord}
          onClearHistory={() => setHistory([])}
        />
      </div>
    </div>
  );
};
