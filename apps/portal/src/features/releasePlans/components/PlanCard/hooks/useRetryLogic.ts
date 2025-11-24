import { QueryClient } from "@tanstack/react-query";
import {
  shouldRetryError,
  calculateRetryDelay,
  getErrorMessage,
  isNonRetryableError,
} from "./useErrorRetry";
import { ErrorCategory } from "../../../../../api/resilience/ErrorHandler";

export async function handleRetryLogic(
  error: unknown,
  retryCount: number,
  maxRetries: number,
  tabIndex: number,
  queryClient: QueryClient
): Promise<boolean> {
  if (isNonRetryableError(error)) {
    throw new Error(
      getErrorMessage(
        error,
        `Error saving tab ${tabIndex}. Please try again.`
      )
    );
  }

  if (!shouldRetryError(error, retryCount, maxRetries)) {
    throw new Error(
      getErrorMessage(error, `Error saving tab ${tabIndex}.`)
    );
  }

  const delay = calculateRetryDelay(error, retryCount);
  await new Promise((resolve) => setTimeout(resolve, delay));

  await queryClient.invalidateQueries({ queryKey: ["plans"] });
  await new Promise((resolve) => setTimeout(resolve, 200));

  return true;
}

