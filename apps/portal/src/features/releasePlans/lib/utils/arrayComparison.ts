/**
 * Utilidades optimizadas para comparación de arrays
 * Reemplaza el uso de JSON.stringify para comparaciones de arrays
 */

/**
 * Compara dos arrays ordenados de forma eficiente
 * @param arr1 Primer array
 * @param arr2 Segundo array
 * @param compareFn Función de comparación opcional (por defecto: comparación directa)
 * @returns true si los arrays son diferentes, false si son iguales
 */
export function compareSortedArrays<T>(
  arr1: T[] | undefined | null,
  arr2: T[] | undefined | null,
  compareFn?: (a: T, b: T) => number
): boolean {
  // Referencia igual = mismo array
  if (arr1 === arr2) return false;
  
  // Ambos null/undefined = iguales
  if (!arr1 && !arr2) return false;
  
  // Uno null/undefined y el otro no = diferentes
  if (!arr1 || !arr2) return true;
  
  // Longitud diferente = diferentes
  if (arr1.length !== arr2.length) return true;
  
  // Si no hay elementos, son iguales
  if (arr1.length === 0) return false;
  
  // Comparación rápida: si no hay función de comparación, usar comparación directa
  const defaultCompareFn = compareFn || ((a: T, b: T) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });
  
  // Crear copias ordenadas solo si es necesario
  const sorted1 = [...arr1].sort(defaultCompareFn);
  const sorted2 = [...arr2].sort(defaultCompareFn);
  
  // Comparar elemento por elemento
  return sorted1.some((item, idx) => item !== sorted2[idx]);
}

/**
 * Compara dos arrays de strings de forma eficiente (case-insensitive)
 * @param arr1 Primer array de strings
 * @param arr2 Segundo array de strings
 * @returns true si los arrays son diferentes, false si son iguales
 */
export function compareStringArrays(
  arr1: string[] | undefined | null,
  arr2: string[] | undefined | null
): boolean {
  return compareSortedArrays(arr1, arr2, (a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );
}

/**
 * Compara dos arrays de IDs (strings) de forma eficiente
 * @param arr1 Primer array de IDs
 * @param arr2 Segundo array de IDs
 * @returns true si los arrays son diferentes, false si son iguales
 */
export function compareIdArrays(
  arr1: string[] | undefined | null,
  arr2: string[] | undefined | null
): boolean {
  return compareSortedArrays(arr1, arr2, (a, b) => a.localeCompare(b));
}

