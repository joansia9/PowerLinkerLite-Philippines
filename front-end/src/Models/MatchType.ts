/**
 * Enumeration defining match type values used by nameComparator and dateComparator.
 * 
 * These values are derived from the documentation on the compareTwoStrings function
 * and from both comparators.
 */
export enum MatchType {
  TooFewWords = -2,
  NotAMatch = -1,
  WeakMatch = 0,
  SimpleStringMatch = 1,
  StrongMatch = 2
}