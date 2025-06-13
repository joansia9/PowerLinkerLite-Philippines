import getCookie from "./getCookie";

const FS_TOKEN_EXPIRATION_HOURS = 1;

export default async function getFSAuthtoken() {
  if (getCookie("fs-token")) return;
  return fetch(process.env.REACT_APP_GROWTH_SPURT_URL + "/api/get-fs-auth")
    .then((res) => res.json())
    .then(({ Token }) => {
      const expirationDate = new Date();
      expirationDate.setHours(
        expirationDate.getHours() + FS_TOKEN_EXPIRATION_HOURS
      );
      document.cookie = `fs-token=${Token};expires=${expirationDate.toUTCString()};`;
      return Token;
    });
}
