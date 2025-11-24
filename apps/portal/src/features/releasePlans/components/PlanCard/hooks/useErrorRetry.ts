import { categorizeError, ErrorCategory } from "../../../../../api/resilience/ErrorHandler";

export interface RetryConfig {
  maxRetries: number;
  retryCount: number;
  lastError: Error | null;
}

export function shouldRetryError(
  error: unknown,
  retryCount: number,
  maxRetries: number
): boolean {
  const errorContext = categorizeError(error);
  return (
    (errorContext.category === ErrorCategory.CONFLICT ||
      errorContext.category === ErrorCategory.RATE_LIMIT ||
      (errorContext.retryable && retryCount < maxRetries - 1)) &&
    retryCount < maxRetries
  );
}

export function calculateRetryDelay(
  error: unknown,
  retryCount: number
): number {
  const errorContext = categorizeError(error);
  if (errorContext.category === ErrorCategory.RATE_LIMIT) {
    return Math.min(2000 * Math.pow(2, retryCount), 10000);
  }
  if (errorContext.category === ErrorCategory.CONFLICT) {
    return Math.min(500 * (retryCount + 1), 2000);
  }
  return Math.min(1000 * Math.pow(2, retryCount), 5000);
}

export function getErrorMessage(
  error: unknown,
  defaultMessage: string
): string {
  const errorContext = categorizeError(error);
  const errorMessage =
    error instanceof Error ? error.message : String(error);
  return errorContext.userMessage || errorMessage || defaultMessage;
}

export function isNonRetryableError(error: unknown): boolean {
  const errorContext = categorizeError(error);
  return (
    errorContext.category === ErrorCategory.VALIDATION ||
    errorContext.category === ErrorCategory.SERVER_ERROR
  );
}

