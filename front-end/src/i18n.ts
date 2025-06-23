import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      header: {
        title: "Power Linker",
        language: "Language"
      },
      home: {
        title: "Match record information to families in the tree",
        hintMessage: "You have completed {{count}} hints.",
        createNew: "Create New"
      },
      upload: {
        title: "Upload Documents",
        dragAndDrop: "Drag and drop files here",
        or: "or",
        browse: "Browse Files"
      },
      footer: {
        copyright: "Copyright © BYU Record Linking Lab 2023. All rights reserved."
      }
    }
  },
  tl: {
    translation: {
      header: {
        title: "Power Linker (tagalog)",
        language: "Wika"
      },
      home: {
        title: "I-match ang impormasyon ng record sa mga pamilya sa puno",
        hintMessage: "Nakumpleto mo ang {{count}} na mga hint.",
        createNew: "Gumawa ng Bago"
      },
      upload: {
        title: "Mag-upload ng mga Dokumento",
        dragAndDrop: "I-drag at i-drop ang mga file dito",
        or: "o",
        browse: "Mag-browse ng mga File"
      },
      footer: {
        copyright: "Copyright © BYU Record Linking Lab 2023. Lahat ng karapatan ay nakalaan."
      }
    }
  },
  es: {
    translation: {
      header: {
        title: "Power Linker (español)",
        language: "Idioma"
      },
      home: {
        title: "Emparejar información de registros con familias en el árbol",
        hintMessage: "Has completado {{count}} pistas.",
        createNew: "Crear Nuevo"
      },
      upload: {
        title: "Subir Documentos",
        dragAndDrop: "Arrastra y suelta archivos aquí",
        or: "o",
        browse: "Buscar Archivos"
      },
      footer: {
        copyright: "Copyright © BYU Record Linking Lab 2023. Todos los derechos reservados."
      }
    }
  }
};

// my language switching engine vroom vroom
i18n
  .use(LanguageDetector) //detects the user's choice
  .use(initReactI18next) // language changes -> react RERENDERs -> new translation shows up in ui 
  .init({
    resources, //loades translations
    fallbackLng: 'en', //default 
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 