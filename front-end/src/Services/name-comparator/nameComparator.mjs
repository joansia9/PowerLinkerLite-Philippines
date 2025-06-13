import unidecode from "unidecode";
import surnamesList from "./dictionaries/_top_surnames.json";

import _nicknames from "./special-case-tokens/_nicknames.json";
import _regex from "./special-case-tokens/_regex.json";
import _substring_sandwiches from "./special-case-tokens/_substring_sandwiches.json";
import _articles_to_remove from "./special-case-tokens/_articles_to_remove.json";

import pronunciationComparison from "./ipa.mjs";
import {
  findWhichWordsMatchAndHowWell,
  loopSubstringSandwichReplacementOverSet,
} from "./shared-functions.mjs";

/**
 * A function to compare two names
 * @param {string} full_name1 the first name
 * @param {string} full_name2 the second name
 * @returns {[boolean, number, Array]} match whether or not it would match
 * Kind of match or reason why it wasn't-- 1 is a simple string match, 2 is a pronunciation match, 0 is a weak match, -1 is skip, -2 is too few words
 * Each member of the array is an array representing a token. First member is the index of the token in name 1, second member is the index of the token in name 2, third member is a score from 0-100 of how close of a match it was
 */
export default function compareTwoNames(full_name1, full_name2) {
  var generic_name, name_too_short, names_match, reasoning, word_combo;
  full_name1 = cleanNameByItself(full_name1);
  full_name2 = cleanNameByItself(full_name2);
  [full_name1, full_name2] = cleanNamesTogether(full_name1, full_name2);
  [name_too_short, word_combo] = eitherNameTooShort(full_name1, full_name2);

  if (name_too_short) {
    reasoning = -2;
    return [false, reasoning, word_combo];
  }

  generic_name = isGenericName(full_name1, full_name2);
  [names_match, word_combo] = spellingComparison(full_name1, full_name2);

  if (names_match) {
    if (generic_name) {
      reasoning = 0;
      return [false, reasoning, word_combo];
    } else {
      reasoning = 1;
      return [true, reasoning, word_combo];
    }
  }

  [names_match, word_combo] = pronunciationComparison(
    full_name1,
    full_name2,
    word_combo
  );

  if (names_match) {
    if (generic_name) {
      reasoning = 0;
      return [false, reasoning, word_combo];
    } else {
      reasoning = 2;
      return [true, reasoning, word_combo];
    }
  } else {
    reasoning = -1;
    return [false, reasoning, word_combo];
  }
}

function cleanNameByItself(name) {
  if (name === "") {
    return "";
  }
  name = name.toLowerCase(); // Makes all letters lowercase
  name = name.replace(/ +/g, " "); // Removes double spaces
  if (name.slice(-1) === " ") {
    // Removes space at end
    name = name.slice(0, -1);
  }
  if (name[0] === " ") {
    // Removes space at beginning
    name = name.slice(1);
  }
  name = unidecode(name); // standardizes name into english alphabet
  // performs several string substitutions
  name = _regex.reduce(
    (name, { regex, flags, replaceWith }) =>
      name.replace(new RegExp(regex, flags), replaceWith),
    name
  );
  name = name.trim(); //Removes extra space at beginning and at end
  return name;
}

function cleanNamesTogether(fullName1, fullName2) {
  // Returns if either name is blank
  if (fullName1 === "" || fullName2 === "") {
    return [fullName1, fullName2];
  }

  // Add space
  fullName1 = fullName1 + " ";
  fullName2 = fullName2 + " ";

  // Fix when records are indexed with " or " in the name
  [fullName1, fullName2] = removeOrInNames(fullName1, fullName2);

  // Replaces ie endings with y endings
  fullName1 = fullName1.replace("ie ", "y ");
  fullName2 = fullName2.replace("ie ", "y ");

  // Replace to 'i' if 'i' and 'y' used interchangeably
  [fullName1, fullName2] = replaceInterchangeables(
    fullName1,
    fullName2,
    "i",
    "y"
  );
  [fullName1, fullName2] = replaceInterchangeables(
    fullName1,
    fullName2,
    "ll",
    "l"
  );

  // Replace nicknames with the standard name
  [fullName1, fullName2] = _nicknames.reduce(
    ([fullName1, fullName2], { nickname, standard_version }) =>
      cleanAwayNickname(fullName1, fullName2, nickname, standard_version),
    [fullName1, fullName2]
  );

  // Remove articles
  [fullName1, fullName2] = _articles_to_remove.reduce(
    ([fullName1, fullName2], article) =>
      removeArticles(fullName1, fullName2, article),
    [fullName1, fullName2]
  );

  // Take care of weird spellings by comparing to the other name
  [fullName1, fullName2] = fixBothNamesSpellingWithRegex(
    fullName1,
    fullName2,
    "ij\\b",
    "y\\b",
    "y "
  );
  [fullName1, fullName2] = fixBothNamesSpellingWithRegex(
    fullName1,
    fullName2,
    "ow",
    "au",
    "au"
  );
  [fullName1, fullName2] = fixBothNamesSpellingWithRegex(
    fullName1,
    fullName2,
    "owlk",
    "olk",
    "olk"
  );

  //handle substring sandwiches
  [fullName1, fullName2] = loopSubstringSandwichReplacementOverSet(
    fullName1,
    fullName2,
    _substring_sandwiches
  );

  //Remove extra spaces
  fullName1 = fullName1.trim();
  fullName2 = fullName2.trim();
  fullName1 = fullName1.replace(/ +/g, " ");
  fullName2 = fullName2.replace(/ +/g, " ");

  // Finally, return
  return [fullName1, fullName2];
}

function removeOrInNames(name1, name2) {
  name1 = name1.toLowerCase();
  name2 = name2.toLowerCase();

  if (name1.includes(" or ") && name2.includes(" or ")) {
    return [name1, name2];
  } else if (name1.includes(" or ")) {
    const name1_edited_A = name1.replace(/[a-z]+ or /g, " ");
    const word_combo_A = findWhichWordsMatchAndHowWell(name1_edited_A, name2);
    const average_score_A =
      word_combo_A.reduce((sum, tup) => sum + tup[2], 0) / word_combo_A.length;

    const name1_edited_B = name1.replace(/ or [a-z]+/g, " ");
    const word_combo_B = findWhichWordsMatchAndHowWell(name1_edited_B, name2);
    const average_score_B =
      word_combo_B.reduce((sum, tup) => sum + tup[2], 0) / word_combo_B.length;

    if (average_score_A >= average_score_B) {
      return [name1_edited_A, name2];
    } else {
      return [name1_edited_B, name2];
    }
  } else if (name2.includes(" or ")) {
    const name2_edited_A = name2.replace(/[a-z]+ or /g, " ");
    const word_combo_A = findWhichWordsMatchAndHowWell(name2_edited_A, name1);
    const average_score_A =
      word_combo_A.reduce((sum, tup) => sum + tup[2], 0) / word_combo_A.length;

    const name2_edited_B = name2.replace(/ or [a-z]+/g, " ");
    const word_combo_B = findWhichWordsMatchAndHowWell(name2_edited_B, name1);
    const average_score_B =
      word_combo_B.reduce((sum, tup) => sum + tup[2], 0) / word_combo_B.length;

    if (average_score_A >= average_score_B) {
      return [name1, name2_edited_A];
    } else {
      return [name1, name2_edited_B];
    }
  }

  // Return the original names if no edits were made
  return [name1, name2];
}

function replaceInterchangeables(name1, name2, toReplace, replacement) {
  name1 = name1.toLowerCase().trim();
  name2 = name2.toLowerCase().trim();
  let words1 = name1.split(" ");
  let words2 = name2.split(" ");
  const word_combo = findWhichWordsMatchAndHowWell(name1, name2);
  for (let match of word_combo) {
    let wordIndexOfName1 = parseInt(match[0]);
    let wordIndexOfName2 = parseInt(match[1]);
    if (
      words1[wordIndexOfName1].replace(toReplace, replacement) ===
      words2[wordIndexOfName2]
    ) {
      words1[wordIndexOfName1] = words1[wordIndexOfName1].replace(
        toReplace,
        replacement
      );
    } else if (
      words1[wordIndexOfName1] ===
      words2[wordIndexOfName2].replace(toReplace, replacement)
    ) {
      words2[wordIndexOfName2] = words2[wordIndexOfName2].replace(
        toReplace,
        replacement
      );
    }
  }
  name1 = words1.join(" ");
  name2 = words2.join(" ");
  return [name1, name2];
}

function cleanAwayNickname(fullName1, fullName2, nickname, standard_version) {
  fullName1 = fullName1.toLowerCase();
  fullName2 = fullName2.toLowerCase();
  const standard_in_one = new RegExp(
    "\\b" + standard_version + "\\b",
    "i"
  ).test(fullName1);
  const standard_in_two = new RegExp(
    "\\b" + standard_version + "\\b",
    "i"
  ).test(fullName2);
  const nickname_in_one = new RegExp("\\b" + nickname + "\\b", "i").test(
    fullName1
  );
  const nickname_in_two = new RegExp("\\b" + nickname + "\\b", "i").test(
    fullName2
  );

  if (standard_in_one && nickname_in_two && !nickname_in_one) {
    fullName2 = fullName2.replace(
      new RegExp("\\b" + nickname + "\\b", "gi"),
      standard_version
    );
  }
  if (standard_in_two && nickname_in_one && !nickname_in_two) {
    fullName1 = fullName1.replace(
      new RegExp("\\b" + nickname + "\\b", "gi"),
      standard_version
    );
  }

  return [fullName1, fullName2];
}

function removeArticles(name1, name2, article) {
  let name1_edited = name1;
  let name2_edited = name2;
  const article_surrounded_by_space = ` ${article} `;
  const article_with_beginning_space = ` ${article}`;

  if (
    name1_edited.includes(article_surrounded_by_space) &&
    name2_edited.includes(article_surrounded_by_space)
  ) {
    // Both names contain the article surrounded by spaces
  } else if (
    name1_edited.includes(article_surrounded_by_space) &&
    name2_edited.includes(article_with_beginning_space)
  ) {
    name1_edited = name1_edited.replace(
      article_surrounded_by_space,
      article_with_beginning_space
    );
  } else if (
    name1_edited.includes(article_with_beginning_space) &&
    name2_edited.includes(article_surrounded_by_space)
  ) {
    name2_edited = name2_edited.replace(
      article_surrounded_by_space,
      article_with_beginning_space
    );
  }

  name1_edited = name1_edited.replace(
    new RegExp(article_surrounded_by_space, "g"),
    " "
  );
  name2_edited = name2_edited.replace(
    new RegExp(article_surrounded_by_space, "g"),
    " "
  );
  name1_edited = name1_edited.replace(/ +/g, " "); // Removes more than one space
  name2_edited = name2_edited.replace(/ +/g, " "); // Removes more than one space

  if (name1 === name1_edited && name2 === name2_edited) {
    // No edits were made, return names without articles
    return [
      name1.replace(article_surrounded_by_space, " "),
      name2.replace(article_surrounded_by_space, " "),
    ];
  }

  // Edits were made, check if the edits were beneficial to the score
  const scores_original_names = findWhichWordsMatchAndHowWell(
    name1.replace(article_surrounded_by_space, " "),
    name2.replace(article_surrounded_by_space, " ")
  );
  const average_score_original_names =
    scores_original_names.reduce((sum, tup) => sum + tup[2], 0) /
    scores_original_names.length;

  const scores_edited_names = findWhichWordsMatchAndHowWell(
    name1_edited,
    name2_edited
  );
  const average_score_edited_names =
    scores_edited_names.reduce((sum, tup) => sum + tup[2], 0) /
    scores_edited_names.length;

  if (average_score_original_names <= average_score_edited_names) {
    // Edits were beneficial to the score, return the edited names
    return [name1_edited, name2_edited];
  }

  // Otherwise, return names without articles
  return [
    name1.replace(article_surrounded_by_space, " "),
    name2.replace(article_surrounded_by_space, " "),
  ];
}

function fixBothNamesSpellingWithRegex(
  name1,
  name2,
  regexToReplace,
  regexPresentInOtherWord,
  replacement
) {
  // Finds if the regex statements are within the names
  const regexToReplaceInName1 = new RegExp(regexToReplace).test(name1);
  const regexToKeepInName1 = new RegExp(regexPresentInOtherWord).test(name1);
  const regexToReplaceInName2 = new RegExp(regexToReplace).test(name2);
  const regexToKeepInName2 = new RegExp(regexPresentInOtherWord).test(name2);

  // Replaces if and only if the one statement is within one, and the other is within the other
  if (
    regexToReplaceInName1 &&
    regexToKeepInName2 &&
    !regexToKeepInName1 &&
    !regexToReplaceInName2
  ) {
    name1 = name1.replace(new RegExp(regexToReplace, "g"), replacement);
  }
  if (
    regexToReplaceInName2 &&
    regexToKeepInName1 &&
    !regexToKeepInName2 &&
    !regexToReplaceInName1
  ) {
    name2 = name2.replace(new RegExp(regexToReplace, "g"), replacement);
  }

  // Cleans up space
  if (name1.endsWith(" ")) {
    name1 = name1.slice(0, -1); // Removes space at the end
  }
  if (name1.startsWith(" ")) {
    name1 = name1.substring(1); // Removes space at the beginning
  }
  if (name2.endsWith(" ")) {
    name2 = name2.slice(0, -1); // Removes space at the end
  }
  if (name2.startsWith(" ")) {
    name2 = name2.substring(1); // Removes space at the beginning
  }
  name1 = name1.replace(/ +/g, " "); // Removes more than one space
  name2 = name2.replace(/ +/g, " "); // Removes more than one space

  // Returns the names with the spellings now fixed
  return [name1, name2];
}

function eitherNameTooShort(name1, name2) {
  // Finds the length of the shortest of the two words
  var combo = findWhichWordsMatchAndHowWell(name1, name2);
  var shortestWordCount = combo.length;

  // Rejects if either name is less than two words in length
  if (shortestWordCount < 2) {
    return [true, combo];
  } else {
    return [false, combo];
  }
}

function isGenericName(name1, name2) {
  // Finds the length of the shortest of the two words
  const combo = findWhichWordsMatchAndHowWell(name1, name2);
  const shortestWordCount = combo.length;

  // If both last names are very rare, returns false
  if (hasRareSurname(name1) && hasRareSurname(name2)) {
    return false;
  }

  // Checks if the initials between the two names makes a match too uncertain
  const name1Words = name1.split(" ");
  const name2Words = name2.split(" ");
  let nonInitialMatchCount = 0;
  for (const match of combo) {
    const [index1, index2] = match;
    const word1 = name1Words[index1];
    const word2 = name2Words[index2];
    const initialInWord1 = word1.length === 1;
    const initialInWord2 = word2.length === 1;
    if (initialInWord1 || initialInWord2) {
      nonInitialMatchCount++;
    }
  }

  if (shortestWordCount <= nonInitialMatchCount + 1) {
    return true;
  } else {
    return false;
  }
}

function hasRareSurname(name) {
  // Isolates the last name
  const nameLower = name.toLowerCase();
  const lastName = nameLower.split(" ").pop();

  // If the last name is not in the list of surnames, returns true
  const surnames = surnamesList.map((tup) => tup[0]);
  if (!surnames.includes(lastName)) {
    return true;
  } else {
    return false;
  }
}

function spellingComparison(name1, name2) {
  // Compares the combination of words that match the best, and to what extent
  const wordCombo = findWhichWordsMatchAndHowWell(name1, name2);

  // Loops through the tuples and counts the number of times the score is greater than 80
  const count = wordCombo.reduce(
    (acc, tup) => (tup[2] > 80 ? acc + 1 : acc),
    0
  );

  // If at least three of the scores are greater than 80, or,
  // if the shortest name is only two words in length and both scores are greater than 80,
  // it's a match
  const minLength = Math.min(name1.split(" ").length, name2.split(" ").length);
  if (count >= 3 || (count === minLength && minLength === 2)) {
    return [true, wordCombo];
  }

  // Otherwise, spelling check returns false
  return [false, wordCombo];
}
