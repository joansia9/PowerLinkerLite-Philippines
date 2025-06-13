import compareTwoDates from "./dateComparator.mjs";
import compareTwoNames from "./nameComparator.mjs";

/**
 * A function to compare two pieces of information
 * @param {string} string1 the first name
 * @param {string} string2 the second name
 * @returns {[boolean, number, [number, number, number][]]} a 3-tuple
 *  1. Whether or not it is a match
 *  2. Kind of match or reason why it wasn't-- 1 is a simple string match, 2 is a strong match (implies a pronounciation match in name comparison), 0 is a weak match, -1 is skip, -2 is too few words
 *  3. Each member of the array is an array representing a token. First member is the index of the token in name 1, second member is the index of the token in name 2, third member is a score from 0-100 of how close of a match it was
 */
export default function compareTwoStrings(string1, string2) {
  if (
    new Date(string1).toString() !== "Invalid Date" &&
    new Date(string2).toString() !== "Invalid Date"
  ) {
    return compareTwoDates(new Date(string1), new Date(string2), 'rules');
  }

  return compareTwoNames(string1, string2);
}
