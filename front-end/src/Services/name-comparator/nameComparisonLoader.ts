/**
 * Dynamic loader for name comparison functionality
 * This file will be code-split into a separate chunk
 */

// Cache the loaded module to avoid re-importing
let cachedComparator: ((string1: string, string2: string) => [boolean, number, [number, number, number][]]) | null = null;
let loadingPromise: Promise<any> | null = null;

// This dynamic import will create a separate chunk
const loadNameComparator = async () => {
  // Return cached version if already loaded
  if (cachedComparator) {
    console.log('✅ Using cached name comparison module');
    return cachedComparator;
  }

  // Return existing promise if already loading
  if (loadingPromise) {
    console.log('⏳ Name comparison module already loading...');
    return loadingPromise;
  }

  console.log('🔄 Loading name comparison module...');
  
  // Create loading promise
  loadingPromise = import('./nameComparator.mjs')
    .then(module => {
      console.log('✅ Name comparison module loaded successfully');
      cachedComparator = module.default;
      loadingPromise = null; // Clear loading promise
      return cachedComparator;
    })
    .catch(error => {
      console.error('❌ Failed to load name comparison module:', error);
      loadingPromise = null; // Clear loading promise on error
      throw error;
    });

  return loadingPromise;
};

// Export function to check if module is already loaded
export const isNameComparatorLoaded = () => cachedComparator !== null;

// Export function to preload the module
export const preloadNameComparator = () => {
  if (!cachedComparator && !loadingPromise) {
    loadNameComparator().catch(() => {
      // Silently fail for preloading
    });
  }
};

export default loadNameComparator; 