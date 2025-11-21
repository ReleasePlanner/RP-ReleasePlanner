import { useEffect, useRef } from "react";
import { useComponentLogger } from "../../../../../utils/logging/simpleLogging";
import type { Plan } from "../../../types";

export function usePlanCardLifecycle(plan: Plan, tasks: unknown[]) {
  const log = useComponentLogger("PlanCard");
  const hasLoggedMount = useRef(false);

  useEffect(() => {
    if (hasLoggedMount.current) {
      return () => {
        hasLoggedMount.current = false;
      };
    }

    hasLoggedMount.current = true;
    const planId = plan.id;
    const taskCount = tasks.length;
    const phaseCount = plan.metadata.phases?.length || 0;

    let idleCallbackId: number | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    if (
      globalThis.window !== undefined &&
      "requestIdleCallback" in globalThis.window
    ) {
      idleCallbackId = requestIdleCallback(
        () => {
          log.lifecycle(
            "mount",
            `Plan ${planId} with ${taskCount} tasks, ${phaseCount} phases`
          );
        },
        { timeout: 1000 }
      );
    } else {
      timeoutId = setTimeout(() => {
        log.lifecycle(
          "mount",
          `Plan ${planId} with ${taskCount} tasks, ${phaseCount} phases`
        );
      }, 0);
    }

    return () => {
      if (
        idleCallbackId !== null &&
        globalThis.window !== undefined &&
        "cancelIdleCallback" in globalThis.window
      ) {
        cancelIdleCallback(idleCallbackId);
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      hasLoggedMount.current = false;
      log.lifecycle("unmount");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return log;
}

