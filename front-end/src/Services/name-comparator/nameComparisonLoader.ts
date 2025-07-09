/**
 * Dynamic loader for name comparison functionality
 * This file will be code-split into a separate chunk
 */

//change 2: module-level dynamic loading (heavy dependencies)

//BEFORE
//In MatchTable.tsx
//MatchTable.tsx - ORIGINAL (static import)
// import compareTwoNames from "../../Services/name-comparator/nameComparator.mjs";
// import compareTwoStrings from "../../Services/name-comparator/index.mjs";
// Then used directly:
// const matchData = compareTwoNames(recordName, treeName);

let cachedComparator: ((string1: string, string2: string) => [boolean, number, [number, number, number][]]) | null = null; //avoid reimports
let loadingPromise: Promise<any> | null = null; //prevents simulatenous downloads!@ 

// This dynamic import will create a separate chunk
const loadNameComparator = async () => {
  // if comparator already exists return it again to avoid re-importing and improve performance
  if (cachedComparator) { return cachedComparator; }

  // if already loading return it again bc it exists and to avoid dupes
  if (loadingPromise) { return loadingPromise; }

  console.log('Loading name comparison module...');
  
  // dynamic import loads the results o
  loadingPromise = import('./nameComparator.mjs') //loads the nameComparator (original guy with ALL functionality)
    .then(results => {
      console.log('importing working');
      cachedComparator = results.default; //store loaded results to use later
      loadingPromise = null; // Clear loading promise
      return cachedComparator; //load the comparison module agian (function of matching names)
    })
    .catch(error => {
      console.error('failed to load results', error);
      loadingPromise = null; // Clear loading promise on error
      throw error;
    });
  return loadingPromise;
};

//checks existance
export const isNameComparatorLoaded = () => cachedComparator !== null;

// Export function to preload the module
export const preloadNameComparator = () => {
  if (!cachedComparator && !loadingPromise) {
    loadNameComparator().catch(() => {}); //silent failing
  }
};

export default loadNameComparator; 

