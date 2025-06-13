import getLambdaURL from "./getLambdaURL";

export default async function uploadHints(csvUri: string): Promise<string> {
  return await fetch(getLambdaURL() + "/upload-hints", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      csvUri,
    }),
  }).then((res) => res.json());
}
