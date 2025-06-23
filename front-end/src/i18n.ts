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
      },
      fields: {
        firstname: "First Name",
        lastname: "Last Name",
        birthdate: "Birth Date",
        birthplace: "Birth Place",
        deathdate: "Death Date",
        father_givenname: "Father's Given Name",
        father_surname: "Father's Surname",
        mother_givenname: "Mother's Given Name",
        mother_surname: "Mother's Surname",
        sex: "Sex",
        relationship: "Relationship",
        pid: "PID",
        ark: "ARK",
        score: "Score",
        url: "URL"
      },
      relationships: {
        Focus: "Focus Person",
        Spouse: "Spouse",
        Mother: "Mother",
        Father: "Father",
        Sister: "Sister",
        Brother: "Brother",
        Child: "Child",
        Other: "Other"
      },
      sex: {
        Male: "Male",
        Female: "Female",
        Unknown: "Unknown"
      }
    }
  },
  tl: {
    translation: {
      header: {
        title: "Power Linker",
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
      },
      fields: {
        firstname: "Pangalan",
        lastname: "Apelyido",
        birthdate: "Petsa ng Kapanganakan",
        birthplace: "Lugar ng Kapanganakan",
        deathdate: "Petsa ng Kamatayan",
        father_givenname: "Pangalan ng Ama",
        father_surname: "Apelyido ng Ama",
        mother_givenname: "Pangalan ng Ina",
        mother_surname: "Apelyido ng Ina",
        sex: "Kasarian",
        relationship: "Relasyon",
        pid: "PID",
        ark: "ARK",
        score: "Puntos",
        url: "URL"
      },
      relationships: {
        Focus: "Pangunahing Tao",
        Spouse: "Asawa",
        Mother: "Ina",
        Father: "Ama",
        Sister: "Kapatid na Babae",
        Brother: "Kapatid na Lalaki",
        Child: "Anak",
        Other: "Iba"
      },
      sex: {
        Male: "Lalaki",
        Female: "Babae",
        Unknown: "Hindi Alam"
      }
    }
  },
  es: {
    translation: {
      header: {
        title: "Power Linker",
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
      },
      fields: {
        firstname: "Nombre",
        lastname: "Apellido",
        birthdate: "Fecha de Nacimiento",
        birthplace: "Lugar de Nacimiento",
        deathdate: "Fecha de Muerte",
        father_givenname: "Nombre del Padre",
        father_surname: "Apellido del Padre",
        mother_givenname: "Nombre de la Madre",
        mother_surname: "Apellido de la Madre",
        sex: "Sexo",
        relationship: "Relación",
        pid: "PID",
        ark: "ARK",
        score: "Puntuación",
        url: "URL"
      },
      relationships: {
        Focus: "Persona Principal",
        Spouse: "Cónyuge",
        Mother: "Madre",
        Father: "Padre",
        Sister: "Hermana",
        Brother: "Hermano",
        Child: "Hijo/a",
        Other: "Otro"
      },
      sex: {
        Male: "Masculino",
        Female: "Femenino",
        Unknown: "Desconocido"
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