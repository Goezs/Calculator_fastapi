import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Calculator } from '../src/components/Calculator';
import { calculatorApi, CalculatorApiError } from '../src/services/calculatorApi';

// Mock calculatorApi
vi.mock('../src/services/calculatorApi', async () => {
  const actual = await vi.importActual<typeof import('../src/services/calculatorApi')>(
    '../src/services/calculatorApi'
  );
  return {
    ...actual,
    calculatorApi: {
      calculate: vi.fn(),
    },
  };
});

describe('Calculator Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders calculator initial display with 0 and keypad buttons', () => {
    render(<Calculator />);
    expect(screen.getByTestId('display-value')).toHaveTextContent('0');
    expect(screen.getByTestId('btn-digit-7')).toBeInTheDocument();
    expect(screen.getByTestId('btn-equals')).toBeInTheDocument();
    expect(screen.getByTestId('btn-clear')).toBeInTheDocument();
  });

  it('performs addition calculation flow successfully', async () => {
    vi.mocked(calculatorApi.calculate).mockResolvedValueOnce({
      operand_a: 7,
      operand_b: 3,
      operation: 'ADDITION',
      result: 10,
    });

    render(<Calculator />);

    // Click 7
    fireEvent.click(screen.getByTestId('btn-digit-7'));
    expect(screen.getByTestId('display-value')).toHaveTextContent('7');

    // Click +
    fireEvent.click(screen.getByTestId('btn-op-add'));

    // Click 3
    fireEvent.click(screen.getByTestId('btn-digit-3'));
    expect(screen.getByTestId('display-value')).toHaveTextContent('3');

    // Click =
    fireEvent.click(screen.getByTestId('btn-equals'));

    await waitFor(() => {
      expect(calculatorApi.calculate).toHaveBeenCalledWith({
        operand_a: 7,
        operand_b: 3,
        operation: 'ADDITION',
      });
      expect(screen.getByTestId('display-value')).toHaveTextContent('10');
    });

    // Check history was updated
    expect(screen.getByText('7 + 3')).toBeInTheDocument();
  });

  it('handles division by zero domain error gracefully without crashing', async () => {
    vi.mocked(calculatorApi.calculate).mockRejectedValueOnce(
      new CalculatorApiError({
        error: 'BAD_REQUEST',
        message: 'Cannot divide by zero',
        timestamp: '2026-11-13T13:30:00Z',
      }, 400)
    );

    render(<Calculator />);

    // Click 8
    fireEvent.click(screen.getByTestId('btn-digit-8'));
    // Click ÷
    fireEvent.click(screen.getByTestId('btn-op-divide'));
    // Click 0
    fireEvent.click(screen.getByTestId('btn-digit-0'));
    // Click =
    fireEvent.click(screen.getByTestId('btn-equals'));

    // Verify error banner is rendered with message
    await waitFor(() => {
      expect(screen.getByTestId('error-banner')).toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toHaveTextContent('Cannot divide by zero');
      expect(screen.getByText('BAD_REQUEST')).toBeInTheDocument();
    });

    // Dismiss banner
    fireEvent.click(screen.getByLabelText('Dismiss error banner'));
    expect(screen.queryByTestId('error-banner')).not.toBeInTheDocument();
  });

  it('clears state on AC button click', () => {
    render(<Calculator />);

    // Click 9
    fireEvent.click(screen.getByTestId('btn-digit-9'));
    expect(screen.getByTestId('display-value')).toHaveTextContent('9');

    // Click AC
    fireEvent.click(screen.getByTestId('btn-clear'));
    expect(screen.getByTestId('display-value')).toHaveTextContent('0');
  });

  it('switches to Direct Inputs form mode and calculates', async () => {
    vi.mocked(calculatorApi.calculate).mockResolvedValueOnce({
      operand_a: 10,
      operand_b: 2,
      operation: 'DIVISION',
      result: 5,
    });

    render(<Calculator />);

    // Switch tab
    fireEvent.click(screen.getByTestId('tab-direct'));
    expect(screen.getByTestId('direct-form')).toBeInTheDocument();

    // Submit form with default 10 and 2
    fireEvent.click(screen.getByTestId('btn-form-submit'));

    await waitFor(() => {
      expect(calculatorApi.calculate).toHaveBeenCalledWith({
        operand_a: 10,
        operand_b: 2,
        operation: 'DIVISION',
      });
      expect(screen.getByTestId('form-result-value')).toHaveTextContent('5');
    });
  });
});
