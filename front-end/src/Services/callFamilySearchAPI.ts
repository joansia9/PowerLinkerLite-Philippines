import getCookie from "./getCookie";

export default async function callFamilySearchAPI(url: string) {
  const fsAuthtoken = getCookie("fs-token");
  if (!fsAuthtoken)
    throw new Error(
      "No Family Search token detected. Have you gotten one from Growth Spurt?"
    );

  return fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + fsAuthtoken,
    },
  }).then((res) => res.json());
}
