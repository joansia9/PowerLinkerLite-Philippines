import "./Home.css";
import {lazy, Suspense} from "react"; //PERFORMANCE: implementing lazy to delay heavy components
// import DocumentMatcher from "../../Components/DocumentMatcher/DocumentMatcher";
import NumidentHint from "../../Models/NumidentHint";
import { useEffect, useState } from "react";
import { Record } from "../../Models/Record";
import { Tree } from "../../Models/Tree";
import submitMatch from "../../Services/submitMatch";
import useGetHint from "../../Services/useGetHint";
import { useTranslation } from 'react-i18next';
import useFormatData from "../../Services/useFormatData";

//Shows a comparison table for each possible ark/pid attachment
// also displays as add/match person table for when there is no match
// has an attach all button at the bottom that greys out if attaching is somehow not possible
// // Add .then for default export compatibility
const DocumentMatcher = lazy(() => import("../../Components/DocumentMatcher/DocumentMatcher").then(module => ({ default: module.default })));
// ... existing code ...

export function Home() {
  const { t } = useTranslation();
  const [hintsDone, setHintsDone] : [number, Function] = useState(0);
  const [hintsRequested, setHintsRequested] = useState <number>(0);
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
  // useEffect(() => {
  //   if (data.length + hintsInFlight < HINT_QUEUE_MAX_SIZE) 
  //     setHintsRequested(hintsRequested + 1);
  // }, [hintsRequested]);
  // PROBLEM: Replace looping useEffect with batched version to prevent overload
  useEffect(() => {
    const deficit = HINT_QUEUE_MAX_SIZE - (data.length + hintsInFlight);
    if (deficit > 0 && hintsInFlight === 0) setHintsRequested(deficit);
  }, [data.length, hintsInFlight]);

  return (
      <main className="page-home">
        <header>
          <h2>{t('home.title') as string}</h2>
        </header>
        <div
          className="book-bg"
          style={{ ['--book' as any]: "url('/newCSSIcons/philippinesBook.png')" }}
        >
        {data[0] ? (
          typeof data[0] === "string" ? (
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
          <Suspense fallback={<div>Loading matcher...</div>}>
              <DocumentMatcher
                hintsDone={hintsDone}
                setHintsDone={setHintsDone}
                record={record}
                tree={tree}
                submit={(isMatch: boolean) => {
                  try {
                    submitMatch({ isMatch, data: data[0] as NumidentHint });
                    data.splice(0, 1);
                    setData([...data]);
                    setHintsRequested(hintsRequested + 1);
                  } catch (e: any) {
                    if (e instanceof Error) setData([e, ...data]);
                  }
                }}
              />
             </Suspense> 
          )
        ) : <div>Loading next hint...</div>}
        </div>
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