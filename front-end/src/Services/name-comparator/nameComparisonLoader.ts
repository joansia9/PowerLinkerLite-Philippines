/**
 * Dynamic loader for name comparison functionality
 * This file will be code-split into a separate chunk
 */

// This dynamic import will create a separate chunk
const loadNameComparator = async () => {
  console.log('🔄 Loading name comparison module...');
  
  // Dynamic import creates a separate webpack chunk
  const module = await import('./nameComparator.mjs');
  
  console.log('✅ Name comparison module loaded successfully');
  return module.default;
};

export default loadNameComparator; 