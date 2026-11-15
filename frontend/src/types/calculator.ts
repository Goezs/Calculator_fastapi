export type OperationType = 'ADDITION' | 'SUBTRACTION' | 'MULTIPLICATION' | 'DIVISION';

export interface CalculateRequest {
  operand_a: number;
  operand_b: number;
  operation: OperationType;
}

export interface CalculateResponse {
  operand_a: number;
  operand_b: number;
  operation: OperationType;
  result: number;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
  timestamp: string;
}

export interface CalculationRecord {
  id: string;
  operand_a: number;
  operand_b: number;
  operation: OperationType;
  result: number;
  timestamp: string;
}
