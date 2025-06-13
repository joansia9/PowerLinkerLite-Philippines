import NumidentHint from "../Models/NumidentHint";
import getLambdaURL from "./getLambdaURL";


/**
 * Computes score and results then asyncronously calls the "/setMatch" endpoint
 * 
 * @param {boolean} isMatch Whether the hint is a match
 * @param {NumidentHint} data A Numident hint
 * @return {Promise<void>} A promise that resolves when "/setMatch" endpoint returns 
 */
export default async function submitMatch({
  isMatch,
  data,
}: {
  isMatch: boolean;
  data?: NumidentHint;
}) {
  if (!data) throw new Error("URL is undefined");

  await fetch(getLambdaURL() + "/set-match", {
    method: "PUT",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({
      url: data.url,
      isMatch: isMatch,
      score: data.score,
      results: data.results,
    }),
  });
}
