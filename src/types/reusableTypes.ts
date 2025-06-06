export function safeParse(jsonString: string): AsyncResult<any> {
  try {
    return { success: true, data: JSON.parse(jsonString) };
  } catch (err) {
    return { success: false, error: new Error(`Invalid JSON: ${err}`) };
  }
}

export type AsyncResult<T> =
  | { success: true; data: T }
  | { success: false; error: Error };

// A reusable wrapper for promises
export async function wrapPromiseResult<T>(
  promise: Promise<T>,
): Promise<AsyncResult<T>> {
  try {
    const data = await promise;
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err : new Error(String(err)),
    };
  }
}
