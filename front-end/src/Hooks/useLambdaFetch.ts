import getLambdaURL from "../Services/getLambdaURL";
import { State, useFetch } from "./useFetch";

/**
 * Automatically calls a lambda based on the environment you're working in
 * @param { string } path The path of the API call, starting with a leading slash (ex. `/hint`)
 * @param { RequestInit } options  Options for the `fetch` call
 * @returns { State } a state object with optional data and error properties
 */
export function useLambdaFetch<T = unknown>(
  path?: string,
  options?: RequestInit
): State<T> {
  return useFetch(getLambdaURL() + path, options);
}
