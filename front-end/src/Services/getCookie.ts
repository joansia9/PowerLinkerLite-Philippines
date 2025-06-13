// thanks https://www.geekstrick.com/snippets/how-to-parse-cookies-in-javascript/
export default function getCookie(searchName: string): string | undefined {
  const cookieVal = document.cookie
    .split(";")
    .map((cookiePair) => cookiePair.split("="))
    .find((cookie) => cookie[0].trim() === searchName.trim());
  return cookieVal && decodeURIComponent(cookieVal[1].trim());
}
