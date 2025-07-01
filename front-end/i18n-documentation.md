# i18n (Internationalization) Documentation

## Overview

PowerLinkerLite uses `react-i18next` for internationalization, supporting four languages:
- **English (en)** - Default language
- **Tagalog (tl)** - Filipino language
- **Spanish (es)** - Spanish language
- **Cebuano (ceb)** - Cebuano/Bisaya language

## Architecture

### Core Files
- `src/i18n.ts` - Main i18n configuration and translation resources
- `src/Components/LanguageSelector/LanguageSelector.tsx` - Language selection component
- `src/Layout/Layout.tsx` - Main layout with language selector integration

### Dependencies
```json
{
  "i18next": "^23.x.x",
  "react-i18next": "^13.x.x", 
  "i18next-browser-languagedetector": "^7.x.x"
}
```

## Configuration

### i18n Setup (`src/i18n.ts`)

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector) // Auto-detects user's browser language
  .use(initReactI18next) // Enables React integration
  .init({
    resources, // Translation resources object
    fallbackLng: 'en', // Default fallback language
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false // Allows HTML in translations
    }
  });
```

### Translation Resources Structure

```typescript
const resources = {
  en: {
    translation: {
      header: { /* header translations */ },
      home: { /* home page translations */ },
      upload: { /* upload page translations */ },
      footer: { /* footer translations */ },
      fields: { /* form field translations */ },
      relationships: { /* relationship type translations */ },
      sex: { /* gender translations */ }
    }
  },
  tl: { /* Tagalog translations */ },
  es: { /* Spanish translations */ }
};
```

## Usage

### Basic Translation

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return <h1>{t('header.title')}</h1>;
}
```

### Translation with Interpolation

```typescript
const { t } = useTranslation();

// With variables
<h3>{t('home.hintMessage', { count: hintsDone })}</h3>

// Translation key: "home.hintMessage": "You have completed {{count}} hints."
```

### Language Switching

```typescript
import { useTranslation } from 'react-i18next';

function LanguageSelector() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <select 
      value={i18n.language} 
      onChange={(e) => changeLanguage(e.target.value)}
    >
      <option value="en">English</option>
      <option value="tl">Tagalog</option>
      <option value="es">Español</option>
    </select>
  );
}
```

### Field Translations

The app includes a custom field translation system:

```typescript
import { useFieldTranslations } from '../../Services/useFormatData';

function MyComponent() {
  const { translateFieldName } = useFieldTranslations();
  
  return (
    <label>{translateFieldName('firstname')}</label>
  );
}
```

## Translation Keys

### Header
- `header.title` - Main application title
- `header.language` - Language selector label

### Home Page
- `home.title` - Main page title
- `home.hintMessage` - Hint completion message with count interpolation
- `home.createNew` - Create new button text

### Upload Page
- `upload.title` - Upload page title
- `upload.dragAndDrop` - Drag and drop instruction
- `upload.or` - "or" separator text
- `upload.browse` - Browse files button text

### Footer
- `footer.copyright` - Copyright notice

### Form Fields
- `fields.firstname` - First name label
- `fields.lastname` - Last name label
- `fields.birthdate` - Birth date label
- `fields.birthplace` - Birth place label
- `fields.deathdate` - Death date label
- `fields.father_givenname` - Father's given name label
- `fields.father_surname` - Father's surname label
- `fields.mother_givenname` - Mother's given name label
- `fields.mother_surname` - Mother's surname label
- `fields.sex` - Sex/gender label
- `fields.relationship` - Relationship label
- `fields.pid` - PID label
- `fields.ark` - ARK label
- `fields.score` - Score label
- `fields.url` - URL label

### Relationships
- `relationships.Focus` - Focus person
- `relationships.Spouse` - Spouse
- `relationships.Mother` - Mother
- `relationships.Father` - Father
- `relationships.Sister` - Sister
- `relationships.Brother` - Brother
- `relationships.Child` - Child
- `relationships.Other` - Other

### Sex/Gender
- `sex.Male` - Male
- `sex.Female` - Female
- `sex.Unknown` - Unknown

## Adding New Languages

### 1. Add Language to Resources

```typescript
// In src/i18n.ts
const resources = {
  // ... existing languages
  fr: {
    translation: {
      header: {
        title: "Power Linker",
        language: "Langue"
      },
      // ... add all other translation keys
    }
  }
};
```

### 2. Add Language to Layout

```typescript
// In src/Layout/Layout.tsx
const languages = [
  { code: 'en', name: 'English' },
  { code: 'tl', name: 'Tagalog' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' } // Add new language
];
```

### 3. Add Language to LanguageSelector

```typescript
// In src/Components/LanguageSelector/LanguageSelector.tsx
<select>
  <option value="en">English</option>
  <option value="tl">Tagalog</option>
  <option value="es">Español</option>
  <option value="fr">Français</option> // Add new language
</select>
```

## Adding New Translation Keys

### 1. Add to All Language Resources

```typescript
// In src/i18n.ts, add to each language:
en: {
  translation: {
    // ... existing keys
    newSection: {
      newKey: "New translation text"
    }
  }
},
tl: {
  translation: {
    // ... existing keys
    newSection: {
      newKey: "Bagong pagsasalin ng teksto"
    }
  }
},
es: {
  translation: {
    // ... existing keys
    newSection: {
      newKey: "Nuevo texto de traducción"
    }
  }
}
```

### 2. Use in Components

```typescript
const { t } = useTranslation();
return <div>{t('newSection.newKey')}</div>;
```

## Best Practices

### 1. Nested Keys
Use nested objects for better organization:
```typescript
// Good
header: {
  title: "Power Linker",
  subtitle: "Record Linking Tool"
}

// Avoid flat structure
headerTitle: "Power Linker",
headerSubtitle: "Record Linking Tool"
```

### 2. Interpolation
Use interpolation for dynamic content:
```typescript
// Translation key
"welcome": "Welcome, {{name}}!"

// Usage
t('welcome', { name: userName })
```

### 3. Pluralization
For count-based translations:
```typescript
// Translation key
"items": "{{count}} item",
"items_plural": "{{count}} items"

// Usage
t('items', { count: itemCount })
```

### 4. Type Safety
Consider using TypeScript interfaces for translation keys:
```typescript
interface TranslationKeys {
  header: {
    title: string;
    language: string;
  };
  // ... other sections
}
```

## Debugging

### Development Mode
Set `debug: true` in i18n configuration to see:
- Missing translation keys
- Language detection logs
- Interpolation errors

### Common Issues

1. **Missing Translation Key**
   - Check console for warnings
   - Ensure key exists in all language resources

2. **Language Not Switching**
   - Verify `i18n.changeLanguage()` is called
   - Check component is using `useTranslation()` hook

3. **Interpolation Not Working**
   - Ensure variables are passed correctly
   - Check translation key uses `{{variableName}}` syntax

## Testing

### Manual Testing
1. Switch languages using the dropdown
2. Verify all text updates immediately
3. Check interpolation works with dynamic content
4. Test fallback behavior with missing translations

### Automated Testing
```typescript
// Example test for translation
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

test('displays translated text', () => {
  render(
    <I18nextProvider i18n={i18n}>
      <MyComponent />
    </I18nextProvider>
  );
  
  expect(screen.getByText('Power Linker')).toBeInTheDocument();
});
```

## Performance Considerations

1. **Bundle Size**: Translation resources are included in the main bundle
2. **Lazy Loading**: Consider lazy loading translations for large applications
3. **Caching**: i18next automatically caches translations in localStorage

## Browser Support

- Modern browsers with ES6+ support
- Automatic language detection from browser settings
- Fallback to English for unsupported languages

## Related Files

- `src/translations/` - Additional translation files (if any)
- `src/Services/useFormatData.ts` - Field translation utilities
- `src/Components/LanguageSelector/` - Language selection components
- `src/Layout/` - Main layout with language integration 