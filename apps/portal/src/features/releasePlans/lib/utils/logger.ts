/**
 * Logger condicional para desarrollo/producción
 * Reemplaza console.log/warn/error con versión optimizada
 */

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Logger que solo funciona en desarrollo
 */
export const devLogger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log('[DEV]', ...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn('[DEV]', ...args);
    }
  },
  
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info('[DEV]', ...args);
    }
  },
  
  table: (data: any) => {
    if (isDevelopment) {
      console.table(data);
    }
  },
  
  group: (label: string) => {
    if (isDevelopment) {
      console.group(label);
    }
  },
  
  groupEnd: () => {
    if (isDevelopment) {
      console.groupEnd();
    }
  },
  
  time: (label: string) => {
    if (isDevelopment) {
      console.time(label);
    }
  },
  
  timeEnd: (label: string) => {
    if (isDevelopment) {
      console.timeEnd(label);
    }
  },
};

/**
 * Logger que siempre funciona (para errores críticos)
 */
export const logger = {
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
  },
  
  // Re-exportar devLogger para uso condicional
  ...devLogger,
};

/**
 * Logger específico para Release Plans
 */
export const planLogger = {
  log: (component: string, message: string, data?: any) => {
    if (isDevelopment) {
      console.log(`[PlanCard:${component}]`, message, data || '');
    }
  },
  
  warn: (component: string, message: string, data?: any) => {
    if (isDevelopment) {
      console.warn(`[PlanCard:${component}]`, message, data || '');
    }
  },
  
  error: (component: string, message: string, error?: any) => {
    console.error(`[PlanCard:${component}]`, message, error || '');
  },
};

