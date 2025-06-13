import substring_bread_sets from "./dictionaries/_substring_bread_sets.json";
import ipa_one_syllable from "./dictionaries/_ipa_one_syllable.json";
import ipa_all_names from "./dictionaries/_ipa_all_names.json";
import _ipa_substring_sandwiches from "./special-case-tokens/_ipa_substring_sandwiches.json";
import { ratio } from "fuzzball";
import unidecode from "unidecode";
import {
  generateCombinations,
  loopSubstringSandwichReplacementOverSet,
} from "./shared-functions.mjs";

export default function pronunciationComparison(name1, name2, namePairs) {
  // Gets Ipas
  let ipaOfName1 = getPronunciation(name1);
  let ipaOfName2 = getPronunciation(name2);

  // Cleans Ipas
  ipaOfName1 = cleanIpaByItself(ipaOfName1);
  ipaOfName2 = cleanIpaByItself(ipaOfName2);
  [ipaOfName1, ipaOfName2] = cleanIpasTogether(ipaOfName1, ipaOfName2);

  // Matches the ipa words within the two names
  // Splits strings into lists of words
  const ipaWords1 = ipaOfName1.split(" ");
  const ipaWords2 = ipaOfName2.split(" ");

  // Initializes empty list to store scores
  const scores = [];

  // Loop through each word in words1 and compare to each word in words2
  for (let i = 0; i < ipaWords1.length; i++) {
    const ipaWord1 = ipaWords1[i];
    for (let j = 0; j < ipaWords2.length; j++) {
      const ipaWord2 = ipaWords2[j];

      // Use fuzz.ratio to compare the words and store the score
      let score = ratio(ipaWord1, ipaWord2);

      // Updates the score if one of the words was an initial
      for (let k = 0; k < namePairs.length; k++) {
        const [index1, index2, initialScore] = namePairs[k];
        if (
          i === parseInt(index1) &&
          j === parseInt(index2) &&
          (initialScore === 100 || initialScore === 0)
        ) {
          score = initialScore;
        }
      }

      // Add the score to scores
      scores.push([`${i} ipaWords1`, `${j} ipaWords2`, score]);
    }
  }

  // Gets the length of the shortest word
  const minLength = Math.min(ipaWords1.length, ipaWords2.length);

  // Generate all combinations of tuples with length equal to the number of words in string2
  let validCombinations = generateCombinations(scores, minLength);

  // Finds the combination with the maximum sum
  const maxCombination = validCombinations.reduce(
    (max, combination) => {
      const sum = combination.reduce((total, tuple) => total + tuple[2], 0);
      return sum > max.sum ? { combination, sum } : max;
    },
    { combination: null, sum: -Infinity }
  ).combination;

  // Cleans the max combo
  const cleanedMaxCombination = maxCombination.map((tuple) => {
    const cleanedTuple = [
      tuple[0].replace(" ipaWords1", "").replace(" ipaWords2", ""),
      tuple[1].replace(" ipaWords1", "").replace(" ipaWords2", ""),
      tuple[2],
    ];
    return cleanedTuple;
  });

  // Gets the smallest score in the max combination
  const lowestScore = Math.min(
    ...cleanedMaxCombination.map((tuple) => tuple[2])
  );

  // If the shortest name is two words in length
  if (minLength === 2) {
    // If the lowest score match is greater than or equal to 80, it's a good pronunciation match
    if (lowestScore >= 80) {
      return [true, cleanedMaxCombination];
    }
    // Otherwise, it's probably skip
    return [false, cleanedMaxCombination];
  }

  // If the shortest name is more than two words
  if (minLength > 2) {
    // If the lowest score match is greater than 75, it's a good pronunciation match
    if (lowestScore > 75) {
      return [true, cleanedMaxCombination];
    }
    // Otherwise, it's probably skip
    return [false, cleanedMaxCombination];
  }
}

function getPronunciation(fullname) {
  const pList = [];
  for (const word of fullname.split(" ")) {
    pList.push(getIpaOfOneWord(word));
  }
  const pronunciationOfFullname = pList.join(" ");
  return pronunciationOfFullname;
}

function getIpaOfOneWord(word) {
  // Setup
  word = word.replace(/ /g, "");
  word = unidecode(word);
  word = word.toLowerCase();
  const pronunciationList = Array(word.length).fill("");

  // Tries to get the ipa from the plain word
  const firstAttempt = hailMary(word);
  if (!firstAttempt.includes("*")) {
    return firstAttempt;
  }

  // While there are still letters in the word
  let substringAdded = true;
  while (substringAdded) {
    // Initialize variables to store the largest matching substring and its length
    substringAdded = false;
    let largestSubstring = "";
    let largestSubstringPronunciation = "";
    let largestSubstringLen = 0;
    let beginningIndexOfSubstring = 0;
    let endIndexOfSubstring = 0;

    // Iterate over every possible substring
    for (let i = 0; i < word.length; i++) {
      for (let j = i + 1; j <= word.length; j++) {
        const substring = word.substring(i, j);

        if (substring.length <= largestSubstringLen) {
          continue;
        }
        if (substring.includes(" ")) {
          continue;
        }
        if (substring.length > 1) {
          const substringIpa = convert(substring);
          if (
            substringIpa.includes("*") ||
            substringIpa.length >= substring.length * 2
          ) {
            continue;
          } else {
            largestSubstringPronunciation = substringIpa;
          }
        } else if (substring.length === 1) {
          const letterToPronunciation = {
            a: "æ",
            b: "b",
            c: "k",
            d: "d",
            e: "ɛ",
            f: "f",
            g: "g",
            h: "h",
            i: "ɪ",
            j: "ʤ",
            k: "k",
            l: "l",
            m: "m",
            n: "n",
            o: "o",
            p: "p",
            q: "k",
            r: "r",
            s: "s",
            t: "t",
            u: "u",
            v: "v",
            w: "w",
            x: "ks",
            y: "j",
            z: "z",
          };
          largestSubstringPronunciation =
            letterToPronunciation[substring] || largestSubstring;
        }

        largestSubstring = substring;
        substringAdded = true;
        largestSubstringLen = substring.length;
        beginningIndexOfSubstring = i;
        endIndexOfSubstring = j;
      }
    }

    // Adds the substring to the list
    if (substringAdded) {
      pronunciationList[beginningIndexOfSubstring] =
        largestSubstringPronunciation;
    }
    const spaces = " ".repeat(largestSubstringLen);
    word = word.replace(/ +$/, " ");
    word =
      word.substring(0, beginningIndexOfSubstring) +
      spaces +
      word.substring(endIndexOfSubstring);
  }

  // Concatonates the list together at the end to get the pronunciation
  const pronunciation = pronunciationList.join("");
  return pronunciation;
}

function hailMary(word) {
  // Example: querying for a word and getting the pronunciation

  for (const entry of ipa_all_names) {
    if (entry[0] === word) {
      const pronunciation = entry[1];
      return pronunciation;
    }
  }
  return word + "*";
}

function convert(word) {
  // Example: querying for a word and getting the pronunciation
  for (const entry of ipa_one_syllable) {
    if (entry[0] === word) {
      const pronunciation = entry[1];
      return pronunciation;
    }
  }
  return word + "*";
}

function cleanIpaByItself(nameIPA) {
  let allIPAConsonants = substring_bread_sets.allIPAConsonants;
  for (const consonant of allIPAConsonants) {
    let doubleConsonant = consonant + consonant;
    if (nameIPA.includes(doubleConsonant)) {
      nameIPA = nameIPA.replace(doubleConsonant, consonant);
    }
  }
  nameIPA = nameIPA.replace("ɛɛ", "i");
  nameIPA = nameIPA.replace("ɪɪ", "ɪ");
  nameIPA = nameIPA.replace("iɪ", "i");
  nameIPA = nameIPA.replace(",", "");
  return nameIPA;
}

function cleanIpasTogether(ipa1, ipa2) {

  //handle substring sandwiches
  [ipa1, ipa2] = loopSubstringSandwichReplacementOverSet(
    ipa1,
    ipa2,
    _ipa_substring_sandwiches
  );
  return [ipa1, ipa2];
}
