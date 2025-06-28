import { useState } from "react";
import uploadHints from "../../Services/uploadHints";
import { useTranslation } from 'react-i18next';

export function Upload() {
  const { t } = useTranslation();
  const [csvUri, setUri] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  return (
    <>
      <div>
        <header>
          <h1>{t('upload.title') as string}</h1>
        </header>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setMessage("Loading...");
            setMessage(await uploadHints(csvUri));
          }}
        >
          <input
            type="text"
            placeholder={t('upload.dragAndDrop')}
            value={csvUri}
            onChange={(e) => setUri(e.target.value)}
          />
          <button type="submit" className="primary">
            {t('upload.browse') as string}
          </button>
          <span>{message}</span>
        </form>
      </div>
    </>
  );
}

/*
┌─────────────────────────────────────┐
│ Header (Title + Language + Logo)    │ ← Layout.tsx
├─────────────────────────────────────┤
│                                     │
│  <div>                              │ ← Upload.tsx (Outlet content)
│    <header>                         │
│      <h1>Upload Title</h1>          │
│    </header>                        │
│    <form>                           │
│      <input />                      │
│      <button>Browse</button>        │
│    </form>                          │
│  </div>                             │
│                                     │
├─────────────────────────────────────┤
│ Footer (Copyright)                  │ ← Layout.tsx
└─────────────────────────────────────┘
*/