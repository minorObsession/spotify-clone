import { ActionFunctionArgs } from "react-router";

export function createLoader<T>(
  nameOfData: string,
  loadingFunction: (id: string) => Promise<T | undefined>,
) {
  return async ({ params }: ActionFunctionArgs): Promise<T> => {
    if (!params.id || typeof params.id !== "string") {
      console.error(`🚨 ❌ Invalid ${nameOfData} ID:`, params.id);
      throw new Response(`Invalid ${nameOfData} ID`, { status: 400 });
    }

    try {
      const data = await loadingFunction(params.id);
      if (!data) {
        throw new Response(`${nameOfData} not found`, { status: 404 });
      }

      // ! hovering data: const data: NonNullable<Awaited<T>>
      // ! NEED TO UNDERSTAND WHAT THIS MEANS
      return data;
    } catch (error) {
      console.error(`🚨 ❌ Failed to load ${nameOfData}:`, error);
      throw new Response(`Failed to fetch ${nameOfData}`, { status: 500 });
    }
  };
}
