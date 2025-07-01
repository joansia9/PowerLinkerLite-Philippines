import "./DocumentMatcher.css";
import { useEffect, useRef, useState } from "react";
import Person from "../../Models/Person";
import { Record } from "../../Models/Record";
import { Tree } from "../../Models/Tree";
import { PotentialMatch } from "../PotentialMatch/PotentialMatch";
import RecordSVG from "../svg/RecordSVG";
import Match from "../../Models/Match";
import { Loading } from "../Loading/Loading";
import { useTranslation } from 'react-i18next';

export default function DocumentMatcher({
  hintsDone,
  setHintsDone,
  record,
  tree,
  submit,
}: {
  hintsDone: number,
  setHintsDone: Function,
  record: Record;
  tree: Tree;
  submit: Function;
}) {
  const { t } = useTranslation();
  const [matches, setMatches]: [Match[], Function] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [buttonsEnabled, setButtonsEnabled] = useState<boolean>(false);
  const buttonsEnablingTimeout = useRef<NodeJS.Timeout>();
  const BUTTONS_ENABLING_TIMEOUT_DURATION_MS = 700;

  useEffect(() => {
    let _matches = record.people?.map((recordPerson, i) => {
      const treePeople = [
        tree.people?.at(i) ??
          new Person({ PID: "xxx-xxxx", firstname: t('errors.personNotFound') as string }),
      ]; // TODO don't love this approach
      return {
        recordPerson,
        treePeople: treePeople,
        selectedCandidate: treePeople.length === 1 ? 0 : undefined,
      };
    });
    setMatches(_matches || []);
    if (record.ARK) setLoading(false);
  }, [record, tree]);

  useEffect(() => {
    clearTimeout(buttonsEnablingTimeout.current);

    // if we're not loading, enable the buttons in one second
    if (!loading) {
      buttonsEnablingTimeout.current = setTimeout(
        () => setButtonsEnabled(true),
        BUTTONS_ENABLING_TIMEOUT_DURATION_MS
      );
    }
    // if we are loading, disable the buttons immediately
    else {
      setButtonsEnabled(false);
    }
  }, [loading]);

  return (
    <form className="document-matcher">
      {record.title ? (
        <h3>
          <RecordSVG />
          {record.title}
        </h3>
      ) : (
        <div/>
      )}
      <div className="potential-matches">
        {matches.map((match, i) => {
          return (
            <PotentialMatch
              key={i}
              recordCandidate={match.recordPerson}
              treeCandidates={match.treePeople}
              attached={match.attached}
              setAttached={(attached: boolean) => {
                const temp = [...matches];
                temp[i].attached = attached;
                setMatches(temp);
              }}
              selectedCandidate={match.selectedCandidate}
              setSelectedCandidate={(selectedCandidate: number) => {
                const temp = [...matches];
                temp[i].selectedCandidate = selectedCandidate;
                setMatches(temp);
              }}
              createPerson={() => {
                const temp = [...matches];
                temp[i].selectedCandidate = -1;
                setMatches(temp);
              }}
              ark={record.ARK}
              pid={tree.PID}
            />
          );
        })}
      </div>
      <div className="button-bar">
        <div className="counter">{t('status.complete') as string + ": " + hintsDone}</div>
        {/* The following will submit info back to Dr. Price's CSV, creating a new column for each row in the process */}
        <div className="attach-buttons">
          <button
            type="button"
            className={"primary" + (!loading ? " false-enabled" : "")}
            onClick={() => {
              submit(true);
              setLoading(true);
              setHintsDone(hintsDone + 1);
            }}
            disabled={!buttonsEnabled}
          >
            {t('buttons.attachAll') as string}
          </button>
          <button
            type="button"
            className={"outlined" + (!loading ? " false-enabled" : "")}
            onClick={() => {
              submit(false);
              setLoading(true);
              setHintsDone(hintsDone + 1);
            }}
            disabled={!buttonsEnabled}
          >
            {t('buttons.skip') as string}
          </button>
        </div>
      </div>
      {loading && <Loading className="fixed" />}
    </form>
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
│                                     │
│    <DocumentMatcher>                │ ← Hints rendered here
│      <h3>Record Title</h3>          │
│      <div className="potential-matches">
│        <PotentialMatch>             │ ← Individual hint cards
│          <h4>Focus Person</h4>      │
│          <MatchTable>               │ ← Hint comparison table
│            // Hint data displayed    │
│          </MatchTable>              │
│        </PotentialMatch>            │
│      </div>                         │
│      <div className="button-bar">   │
│        <div>Complete: {hintsDone}</div>
│        <button>Attach All</button>  │
│        <button>Skip</button>        │
│      </div>                         │
│    </DocumentMatcher>               │
│  </main>                            │
│                                     │
├─────────────────────────────────────┤
│ Footer (Copyright)                  │ ← Layout.tsx
└─────────────────────────────────────┘
*/