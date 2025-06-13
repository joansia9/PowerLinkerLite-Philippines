import { partial_ratio } from "fuzzball";
import substring_bread_sets from "./dictionaries/_substring_bread_sets.json";

export function loopSubstringSandwichReplacementOverSet(
  string1,
  string2,
  sandwichSet
) {
  return sandwichSet.reduce(
    (
      [string1, string2],
      { filling1, filling2, leftBread, rightBread, minLength }
    ) => {
      // Substitute names of sets for sets
      // Left
      if (leftBread === "consonants")
        leftBread = substring_bread_sets.consonants;
      else if (leftBread === "all_letters")
        leftBread = substring_bread_sets.all_letters;
      else if (leftBread === "dashAndAllIPACons")
        leftBread = [...substring_bread_sets.allIPAConsonants, "-"];
      else if (leftBread === "allIPAConsonants")
        leftBread = substring_bread_sets.allIPAConsonants;
      else if (leftBread === "allIPAVowels")
        leftBread = substring_bread_sets.allIPAVowels;

      // Right
      if (rightBread === "consonants")
        rightBread = substring_bread_sets.consonants;
      else if (rightBread === "all_letters")
        rightBread = substring_bread_sets.all_letters;
      else if (rightBread === "dashAndAllIPACons")
        rightBread = [...substring_bread_sets.allIPAConsonants, "-"];
      else if (rightBread === "allIPAConsonants")
        rightBread = substring_bread_sets.allIPAConsonants;
      else if (rightBread === "allIPAVowels")
        rightBread = substring_bread_sets.allIPAVowels;

      return replaceSubstringSandwichMiddleIfMatchingBread(
        string1,
        string2,
        filling1,
        filling2,
        leftBread,
        rightBread,
        minLength
      );
    },
    [string1, string2]
  );
}

/**
 * Pattern recognition. Looks to see if, for example, two consonants are on either side of a vowel that sounds like another vowel ex. Johnson and Johnsen
 *
 * @param {string} string1 the first string being compared
 * @param {string} string2 the second string being compared
 * @param {string} middle_option_1 option 1 for the "sandwich filling"
 * @param {string} middle_option_2 option 2 for the "sandwich filling"
 * @param {string[]} bread_1 a list of substrings that could appear before the "filling". String1 and string2 must use the same substring from the list
 * @param {string[]} bread_2 a list of substrings that could appear directly after the "filling". String1 and string2 must use the same substring from the list
 * @param {number} min_required_letters One of the word being examined must be longer than this
 * @returns {[string, string]} updated versions of string 1 and string2
 */
function replaceSubstringSandwichMiddleIfMatchingBread(
  string1,
  string2,
  middle_option_1,
  middle_option_2,
  bread_1,
  bread_2,
  min_required_letters
) {
  if (
    (!string1.includes(middle_option_1) &&
      !string1.includes(middle_option_2)) ||
    (!string2.includes(middle_option_1) && !string2.includes(middle_option_2))
  ) {
    return [string1, string2];
  }

  var word_combo = findWhichWordsMatchAndHowWell(string1, string2);
  var final_string_1 = string1.split(" ");
  var final_string_2 = string2.split(" ");

  for (var match of word_combo) {
    var match_index_string1 = parseInt(match[0]);
    var match_index_string2 = parseInt(match[1]);
    var word_in_string1 = final_string_1[match_index_string1];
    var word_in_string2 = final_string_2[match_index_string2];
    if (
      word_in_string1.length < min_required_letters ||
      word_in_string2.length < min_required_letters
    ) {
      continue;
    }
    word_in_string1 = "-" + word_in_string1 + "-";
    word_in_string2 = "-" + word_in_string2 + "-";

    var vowels_regex = "(" + middle_option_1 + "|" + middle_option_2 + ")";

    for (var i = 0; i < bread_1.length; i++) {
      var cons1 = bread_1[i];
      if (
        !word_in_string1.includes(cons1) ||
        !word_in_string2.includes(cons1)
      ) {
        continue;
      }
      for (var j = 0; j < bread_2.length; j++) {
        var cons2 = bread_2[j];
        if (
          !word_in_string1.includes(cons2) ||
          !word_in_string2.includes(cons2)
        ) {
          continue;
        }

        var regex_to_find = cons1 + vowels_regex + cons2;
        var results1 = word_in_string1.match(regex_to_find);
        var results2 = word_in_string2.match(regex_to_find);
        if (!results1 || !results2) {
          continue;
        }
        var spanA1 = results1.index;
        var spanB1 = spanA1 + results1[0].length;
        var spanA2 = results2.index;
        var spanB2 = spanA2 + results2[0].length;
        if (Math.abs(spanA1 - spanA2) <= 2 && Math.abs(spanB1 - spanB2) <= 2) {
          if (results1[0] !== results2[0]) {
            word_in_string1 = word_in_string1.replace(results1[0], results2[0]);
          }
        }
      }
    }

    word_in_string1 = word_in_string1.replace(/-/g, "");
    word_in_string2 = word_in_string2.replace(/-/g, "");

    final_string_1[match_index_string1] = word_in_string1;
    final_string_2[match_index_string2] = word_in_string2;
  }

  return [final_string_1.join(" "), final_string_2.join(" ")];
}

export function generateCombinations(scores, n) {
  const combinations = [];

  function backtrack(combination, start) {
    if (combination.length === n) {
      combinations.push([...combination]);
      return;
    }

    for (let i = start; i < scores.length; i++) {
      const [word1, word2, score] = scores[i];
      const hasDuplicate = combination.some(
        ([prevWord1, prevWord2]) => prevWord1 === word1 || prevWord2 === word2
      );

      if (!hasDuplicate) {
        combination.push([word1, word2, score]);
        backtrack(combination, i + 1);
        combination.pop();
      }
    }
  }

  backtrack([], 0);
  return combinations;
}

export function findWhichWordsMatchAndHowWell(name1, name2) {
  // Split strings into lists of words
  name1 = name1.trim();
  name2 = name2.trim();
  let words1 = name1.split(" ");
  let words2 = name2.split(" ");

  // Initialize empty list to store scores
  let scores = [];

  // Loops through each word in words1 and compare to each word in words2
  for (let i = 0; i < words1.length; i++) {
    let word1 = words1[i];
    for (let j = 0; j < words2.length; j++) {
      let word2 = words2[j];

      // Gets the score for how well the words match by using fuzz.partial_ratio
      let score = partial_ratio(word1, word2);

      // Unless word1 or word2 is only an initial,
      if (word1.length === 1 || word2.length === 1) {
        // If the initial matches the first letter of the other word, give it a perfect score
        if (word1[0] === word2[0]) {
          score = 100;
        } else {
          // Otherwise the score is 0
          score = 0;
        }
      }

      // Add the score to scores
      scores.push([`${i} words1`, `${j} words2`, score]);
    }
  }

  // Gets the length of the shortest word
  let min_length = Math.min(words1.length, words2.length);

  // Generate all combinations of tuples with length equal to the number of words in string2
  let valid_combinations = generateCombinations(scores, min_length);

  // Cleans the valid combinations
  let cleaned_valid_combinations = [];
  for (let valid_combo of valid_combinations) {
    let cleaned_valid_combo = [];
    for (let tup of valid_combo) {
      let cleaned_tup = [
        tup[0].replace(" words1", "").replace(" words2", ""),
        tup[1].replace(" words1", "").replace(" words2", ""),
        tup[2],
      ];
      cleaned_valid_combo.push(cleaned_tup);
    }
    cleaned_valid_combinations.push(cleaned_valid_combo);
  }

  // Find the combination(s) with the maximum sum
  let max_sum = cleaned_valid_combinations.reduce((max, combo) => {
    let sum = combo.reduce((acc, y) => acc + y[2], 0);
    return Math.max(max, sum);
  }, 0);

  let max_combinations = cleaned_valid_combinations.filter(
    (combo) => combo.reduce((acc, y) => acc + y[2], 0) === max_sum
  );

  // Assigns the max score combination with the most letters to be best_combo
  let best_combo = [];
  let max_letter_count = 0;
  for (let combo of max_combinations) {
    let letter_count = 0;
    for (let tup of combo) {
      let [x, y] = [parseInt(tup[0]), parseInt(tup[1]), tup[2]];
      letter_count += words1[x].length + words2[y].length;
    }
    if (letter_count > max_letter_count) {
      max_letter_count = letter_count;
      best_combo = combo;
    }
  }

  // Returns the combination of word matches that are the closest match
  return best_combo;
}
