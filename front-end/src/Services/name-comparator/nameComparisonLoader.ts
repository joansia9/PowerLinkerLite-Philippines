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

let cachedComparator: ((string1: string, string2: string) => [boolean, number, [number, number, number][]]) | null = null;
let loadingPromise: Promise<any> | null = null;

// This dynamic import will create a separate chunk
const loadNameComparator = async () => {
  // if comparator already exists return it to avoid re-importing
  if (cachedComparator) { 
    return cachedComparator; 
  }

  // if already loading return the promise to avoid duplicates
  if (loadingPromise) { 
    return loadingPromise; 
  }

  console.log('Loading name comparison module...');
  
  // Use webpack magic comments to control chunk naming and loading (original guy with ALL functionality)
  loadingPromise = import(
    /* webpackChunkName: "name-comparator" */
    /* webpackMode: "lazy" */
    './nameComparator.mjs'
  )
    .then(results => {
      console.log('importing working + Name comparator loaded successfully');
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

// Export function to check if comparator is loaded
export const isNameComparatorLoaded = () => cachedComparator !== null;

// Export function to preload the module (only if not already loaded/loading)
export const preloadNameComparator = () => {
  if (!cachedComparator && !loadingPromise) {
    loadNameComparator().catch(error => { //silent fail
      console.warn('Failed to preload name comparator:', error);
    });
  }
};

// Export function to clear the cache (useful for testing)
export const clearNameComparatorCache = () => {
  cachedComparator = null;
  loadingPromise = null;
};

export default loadNameComparator; 

