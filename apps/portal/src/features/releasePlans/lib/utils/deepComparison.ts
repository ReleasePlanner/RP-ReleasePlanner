/**
 * Utilidades optimizadas para comparación profunda de objetos
 * Reemplaza el uso de JSON.stringify para comparaciones profundas
 */

/**
 * Compara dos valores de forma profunda pero eficiente
 * Usa comparación por referencia primero, luego shallow, luego deep solo si es necesario
 */
export function deepEqual<T>(a: T, b: T): boolean {
  // Referencia igual = mismo objeto
  if (a === b) return true;
  
  // Uno null/undefined y el otro no = diferentes
  if (a == null || b == null) return false;
  
  // Tipos diferentes = diferentes
  if (typeof a !== typeof b) return false;
  
  // Primitivos: ya comparados arriba con ===
  if (typeof a !== 'object') return false;
  
  // Arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => deepEqual(item, b[index]));
  }
  
  // Si uno es array y el otro no = diferentes
  if (Array.isArray(a) || Array.isArray(b)) return false;
  
  // Objetos: comparar propiedades
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  return keysA.every(key => {
    if (!(key in b)) return false;
    return deepEqual((a as any)[key], (b as any)[key]);
  });
}

/**
 * Compara dos objetos de forma shallow (solo primer nivel)
 * Más rápido que deepEqual pero menos preciso
 */
export function shallowEqual<T extends Record<string, any>>(
  a: T | undefined | null,
  b: T | undefined | null
): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  return keysA.every(key => a[key] === b[key]);
}

/**
 * Compara dos objetos de forma optimizada:
 * 1. Comparación por referencia (más rápida)
 * 2. Comparación shallow (rápida)
 * 3. Comparación deep solo si es necesario (más lenta)
 */
export function optimizedEqual<T>(
  a: T,
  b: T,
  deep: boolean = false
): boolean {
  if (a === b) return true;
  if (!deep) return shallowEqual(a as any, b as any);
  return deepEqual(a, b);
}

