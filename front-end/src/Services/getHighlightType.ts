import { HighlightType } from "../Models/HighlightType";
import { MatchType } from "../Models/MatchType";

/**
 * Calculates the appropriate highlight color given output from nameComparator or dateComparator.
 * @param {string} string1 the first name or date
 * @param {string} string2 the second name or date
 * @returns {number} a rating 0-2 in which 0 is a match (Green), 1 is undecided (None), and 2 is skip (Red)
 */
export default function getHighlightType(string1: string, string2: string,
                                        matchData: [boolean, number, [number, number, number][]],
                                        type: string) {

  let highlightType;
  if (!string1.replace(/\s+/g, '') || !string2.replace(/\s+/g, '')) {
    highlightType = HighlightType.None;
  } else if (type === 'date') {
    let matchType = matchData[1]
    if (matchType === MatchType.StrongMatch) {
      highlightType = HighlightType.Green;
    } else if (matchType === MatchType.WeakMatch) {
      highlightType = HighlightType.None;
    } else {
      highlightType = HighlightType.Red;
    }
  } else if (type === 'name') {
    let isMatch = matchData[0];
    let scores = matchData[2].map((matchDetails) => matchDetails[2]);
    let averageScore = scores.reduce((accumulator, score) => accumulator + score, 0)/scores.length;

    if (averageScore > 95 || isMatch) {
      highlightType = HighlightType.Green;
    } else if (averageScore > 65 && averageScore <= 95) {
      highlightType = HighlightType.None;
    } else {
      highlightType = HighlightType.Red;
    }
  } else {
    throw new Error('Paramter \'type\' must have one of the following values: \'name\', \'date\'.')
  }

  return highlightType;
}
