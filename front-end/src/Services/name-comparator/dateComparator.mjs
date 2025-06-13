// @ts-check

/**
 * A function encapsulating two algorithms for comparing dates.
 * 
 * The 'rules' approach rates how close each field is
 * and then uses a ruleset to decide how much two dates match. 
 * 
 * The 'weighted' approach calculates scores which
 * are multiplied by weights and then summed to get a weighted score.
 * 
 * Both approaches are in case one suits a particular task better than the other.
 * 
 * @param {Date} date1 the first date
 * @param {Date} date2 the second date
 * @param {String} method string that determines whether to use 'rules' approach or 'heuristic' approach
 * @returns {[boolean, number, [number, number, number][]]} a 3-tuple
 *  1. Whether or not it is a match
 *  2. Kind of match or reason why it wasn't-- 2 is a strong match, 0 is a weak match, -1 is skip
 *  3. Each member of the array is an array representing a token. First member is the index of the token in name 1, second member is the index of the token in name 2, third member is a score from 0-100 of how close of a match it was
 */
export default function compareTwoDates(date1, date2, method) {
  if (method === 'rules') {
    return compareTwoDatesRuleBased(date1, date2);
  } else if (method === 'weighted') {
    return compareTwoDatesWeighted(date1, date2);
  } else {
    throw new Error('Paramter \'method\' must have one of the following values: \'rules\', \'weighted\'.')
  }
}

/**
 * A function to compare the closeness of two dates.
 * 
 * Rates day, month, and year comparisons on a scale 0-2 and then uses a ruleset to determine match type.
 * 
 * @param {Date} date1 the first name
 * @param {Date} date2 the second name
 * @returns {[boolean, number, [number, number, number][]]} a 3-tuple
 *  1. Whether or not it is a match
 *  2. Kind of match or reason why it wasn't-- 2 is a strong match, 0 is a weak match, -1 is skip
 *  3. Each member of the array is an array representing a token. First member is the index of the token in name 1, second member is the index of the token in name 2, third member is a score from 0-100 of how close of a match it was
 */
function compareTwoDatesRuleBased(date1, date2) {
  const date1Day = date1.getUTCDate();
  const date1Month = date1.getUTCMonth();
  const date1Year = date1.getUTCFullYear();
  const date2Day = date2.getUTCDate();
  const date2Month = date2.getUTCMonth();
  const date2Year = date2.getUTCFullYear();

  const dayMax = Math.max(daysInMonth(date1Month), daysInMonth(date2Month));
  const DAY_STRONGMATCH_CUTOFF = 0;
  const DAY_NOTAMATCH_CUTOFF = 5;
  const dayDiff = getDifferenceWithWrapAround(date1Day, date2Day, dayMax)
  let dayScore = getScore(DAY_STRONGMATCH_CUTOFF, DAY_NOTAMATCH_CUTOFF, dayDiff);

  const MONTH_STRONGMATCH_CUTOFF = 0;
  const MONTH_NOTAMATCH_CUTOFF = 3;
  const monthDiff = getDifferenceWithWrapAround(date1Month, date2Month, 12)
  let monthScore = getScore(MONTH_STRONGMATCH_CUTOFF, MONTH_NOTAMATCH_CUTOFF, monthDiff);
  
  const YEAR_STRONGMATCH_CUTOFF = 0;
  const YEAR_NOTAMATCH_CUTOFF = 5;
  const yearDiff = Math.abs(date1Year-date2Year);
  let yearScore = getScore(YEAR_STRONGMATCH_CUTOFF, YEAR_NOTAMATCH_CUTOFF, yearDiff);

  let matchType;
  const scores = [dayScore, monthScore, yearScore];
  const zeroes = scores.filter((num) => num === 0);
  const total = scores.reduce((prev, curr) => prev + curr);
  if (zeroes.length > 0) {
    matchType = -1;
  } else if (total === 6) {
    matchType = 2;
  } else if (total <= 5 && total > 3) {
    matchType = 0;
  } else {
    matchType = -1;
  }

  let isMatch;
  if (matchType === 2) {
    isMatch = true;
  } else {
    isMatch = false;
  }

  const /** @type {[number, number, number][]} */ matchDetails = [
    [0, 0, yearScore * 50],
    [1, 1, monthScore * 50],
    [2, 2, dayScore * 50],
  ];
  return [isMatch, matchType, matchDetails];
}

/**
 * A function to return a score rating the proximity of two numbers on a scale from 0-2.
 * Uses custom score cutoffs in calculating the score.
 * 
 * @param {number} strongMatchCutoff the highest difference at which two comparison values are considered a strong match
 * @param {number} notAMatchCutoff the lowest difference at which two comparison values are considered skip
 * @param {number} diff the difference to which a score shall be assigned
 */
function getScore(strongMatchCutoff, notAMatchCutoff, diff) {
  let score;
  if (diff <= strongMatchCutoff) {
    score = 2;
  } else if (diff > strongMatchCutoff && diff < notAMatchCutoff) {
    score = 1;
  } else {
    score = 0;
  }
  return score;
}

/**
 * A function to compare the closeness of two dates.
 * 
 * Creates decimal scores of each field which are
 * multiplied by weights and summed to create a weighted score.
 * 
 * @param {Date} date1 the first date
 * @param {Date} date2 the second date
 * @returns {[boolean, number, [number, number, number][]]} a 3-tuple
 *  1. Whether or not it is a match
 *  2. Kind of match or reason why it wasn't-- 2 is a strong match, 0 is a weak match, -1 is skip
 *  3. Each member of the array is an array representing a token. First member is the index of the token in name 1, second member is the index of the token in name 2, third member is a score from 0-100 of how close of a match it was
 */
function compareTwoDatesWeighted(date1, date2) {
  const date1Day = date1.getUTCDate();
  const date1Month = date1.getUTCMonth();
  const date1Year = date1.getUTCFullYear();
  const date2Day = date2.getUTCDate();
  const date2Month = date2.getUTCMonth();
  const date2Year = date2.getUTCFullYear();

  const dayMax = Math.max(daysInMonth(date1Month), daysInMonth(date2Month));
  const DAY_DIFF_MAX = 5;
  const dayDiff = getDifferenceWithWrapAround(date1Day, date2Day, dayMax);
  let dayScore = 1 - dayDiff / DAY_DIFF_MAX; // 100% for a perfect match, 0% for furthest possible
  if (dayScore < 0) {
    dayScore = 0;
  }

  const MONTH_DIFF_MAX = 2;
  const monthDiff = getDifferenceWithWrapAround(date1Month, date2Month, 12);
  let monthScore = 1 - monthDiff / MONTH_DIFF_MAX;
  if (monthScore < 0) {
    monthScore = 0;
  }

  const YEAR_DIFF_MAX = 2;
  const yearDiff = Math.abs(date1Year - date2Year);
  let yearScore = 1 - yearDiff / YEAR_DIFF_MAX;
  if (yearScore < 0) {
    yearScore = 0;
  }

  // 3:2:1 weighting system
  const YEAR_WEIGHT = 50;
  const MONTH_WEIGHT = 33;
  const DAY_WEIGHT = 17;

  const weightedScore =
    yearScore * YEAR_WEIGHT + monthScore * MONTH_WEIGHT + dayScore * DAY_WEIGHT;
  const isMatch = weightedScore > 80;
  const matchType =
    /* if */ weightedScore > 95
      ? 2
      : /* else if */ weightedScore >= 80 && weightedScore <= 95
      ? 0
      : /* else */ -1;
  const /** @type {[number, number, number][]} */ matchDetails = [
      [0, 0, yearScore * 100],
      [1, 1, monthScore * 100],
      [2, 2, dayScore * 100],
    ];
  return [isMatch, matchType, matchDetails];
}

/**
 * Returns the distance between two numbers.
 * Takes into account wraparounds so the distance between month 1 and month 12 is 1
 * @param {number} num1
 * @param {number} num2
 * @param {number} range defines the number of values before wrapping back around
 *  If two numbers are passed in, they will be treated as [min, max]
 * @returns {number} the distance between the numbers on a cyclical number line
 */
function getDifferenceWithWrapAround(num1, num2, range) {

  let smallerNum, biggerNum;
  if (num1 < num2) {
    smallerNum = num1;
    biggerNum = num2;
  } else {
    smallerNum = num2;
    biggerNum = num1;
  }

  const directDiff = biggerNum - smallerNum;
  const wrapAroundDiff = smallerNum - (biggerNum - range);

  return Math.min(directDiff, wrapAroundDiff);
}

/**
 * Gets the number of days in a month
 * @param {number} month the month, 0-indexed (0-11)
 */
function daysInMonth(month) {
  return new Date(new Date().getFullYear(), month, 0).getDate();
}
