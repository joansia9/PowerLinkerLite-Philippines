import "./Home.css";
import DocumentMatcher from "../../Components/DocumentMatcher/DocumentMatcher";
import NumidentHint from "../../Models/NumidentHint";
import { useEffect, useState } from "react";
import { Record } from "../../Models/Record";
import { Tree } from "../../Models/Tree";
import useFormatData, { useFieldTranslations } from "../../Services/useFormatData";
import submitMatch from "../../Services/submitMatch";
import useGetHint from "../../Services/useGetHint";
import { useTranslation } from 'react-i18next';

//Shows a comparison table for each possible ark/pid attachment
// also displays as add/match person table for when there is no match
// has an attach all button at the bottom that greys out if attaching is somehow not possible
export function Home() {
  const { t } = useTranslation();
  const { translateFieldName } = useFieldTranslations();
  const [hintsDone, setHintsDone] : [number, Function] = useState(0);
  const [hintsRequested, setHintsRequested]: [number, Function] = useState(0);
  const [hintsInFlight, setHintsInFlight] = useState<number>(0);
  const [data, setData] = useState<(NumidentHint | Error)[]>([]);
  const [record, setRecord]: [Record, Function] = useState(new Record({}));
  const [tree, setTree]: [Tree, Function] = useState(new Tree({}));

  const HINT_QUEUE_MAX_SIZE = 10;

  useGetHint({
    hintsRequested,
    data,
    setData,
    setHintsInFlight,
    maxHints: HINT_QUEUE_MAX_SIZE,
  });
  useFormatData({ data, setRecord, setTree });
  // Fill rest of the queue
  useEffect(() => {
    if (data.length + hintsInFlight < HINT_QUEUE_MAX_SIZE) 
      setHintsRequested(hintsRequested + 1);
    // eslint-disable-next-line
  }, [hintsRequested]);

  return (
      <main className="page-home">
        <header>
          <h2>{t('home.title') as string}</h2>
        </header>
        
        {/* Field Translation Test */}
        <div style={{ 
          background: 'pink', 
          padding: '10px', 
          margin: '10px 0', 
          borderRadius: '5px',
          fontSize: '14px'
        }}>
          <strong>{t('test.fieldTranslation') as string}:</strong><br/>
          {t('fields.firstname') as string}: {translateFieldName('firstname')}<br/>
          {t('fields.lastname') as string}: {translateFieldName('lastname')}<br/>
          {t('fields.birthdate') as string}: {translateFieldName('birthdate')}<br/>
          {t('fields.birthplace') as string}: {translateFieldName('birthplace')}<br/>
          {t('fields.deathdate') as string}: {translateFieldName('deathdate')}<br/>
          {t('fields.father_givenname') as string}: {translateFieldName('father_givenname')}<br/>
          {t('fields.father_surname') as string}: {translateFieldName('father_surname')}<br/>
          {t('fields.mother_givenname') as string}: {translateFieldName('mother_givenname')}<br/>
          {t('fields.mother_surname') as string}: {translateFieldName('mother_surname')}<br/>
          Switch languages in the header to see translations!
        </div>
        
        {typeof data[0] === "string" ? (
          <div>
            <div className="hint-message">{data[0]}</div>
            {hintsDone > 0 ? (
              <h3 className="counter">{t('home.hintMessage', { count: hintsDone }) as string}</h3>
            ) : (
              <div/>
            )}
          </div>
        ) : data[0] instanceof Error ? (
          <div>
            <div className="hint-message">{data[0].message}</div>
            {hintsDone > 0 ? (
              <h3 className="counter">{t('home.hintMessage', { count: hintsDone }) as string}</h3>
            ) : (
              <div/>
            )}
          </div>
        ) : (
            <DocumentMatcher
              hintsDone={hintsDone}
              setHintsDone={setHintsDone}
              record={record}
              tree={tree}
              submit={(isMatch: boolean) => {
                try {
                  submitMatch({ isMatch, data: data[0] as NumidentHint });
                  data.splice(0, 1); // Slow. Could be replaced by a full queue implemenation if needed
                  setData([...data]);
                  setHintsRequested(hintsRequested + 1);
                } catch (e: any) {
                  if (e instanceof Error) setData([e, ...data]);
                }
              }}
            />
        )}
      </main>
  );
}

/*
┌─────────────────────────────────────┐
│ Header (Title + Language + Logo)    │ ← Layout.tsx
├─────────────────────────────────────┤
│                                     │
│  <main className="page-home">       │ ← Home.tsx (Outlet content)
│    <header>                         │
│      <h2>Home Title</h2>            │
│    </header>                        │
│    <DocumentMatcher />              │
│  </main>                            │
│                                     │
├─────────────────────────────────────┤
│ Footer (Copyright)                  │ ← Layout.tsx
└─────────────────────────────────────┘
*/