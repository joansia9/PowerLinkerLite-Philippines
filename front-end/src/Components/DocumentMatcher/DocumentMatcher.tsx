import "./DocumentMatcher.css";
import { useEffect, useRef, useState } from "react";
import Person from "../../Models/Person";
import { Record } from "../../Models/Record";
import { Tree } from "../../Models/Tree";
import { PotentialMatch } from "../PotentialMatch/PotentialMatch";
import Match from "../../Models/Match";
import { Loading } from "../Loading/Loading";
import { useTranslation } from 'react-i18next';
import PixelButton from "../PixelButton/PixelButton";
import NewWindowLink from "../NewWindowLink/NewWindowLink";

export default function DocumentMatcher({
  hintsDone,
  setHintsDone,
  record,
  tree,
  submit,
}: {
  hintsDone: number,
  setHintsDone: (count: number) => void,
  record: Record;
  tree: Tree;
  submit: (isMatch: boolean) => void;
}) {
  const { t } = useTranslation();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [buttonsEnabled, setButtonsEnabled] = useState<boolean>(false);
  const buttonsEnablingTimeout = useRef<NodeJS.Timeout>();
  const BUTTONS_ENABLING_TIMEOUT_DURATION_MS = 100; //edited this to make faster
  const sourceLinkerURL: string =
    "https://www.familysearch.org/search/linker?pal=/ark:/61903/1:1:" +
    record.ARK +
    "&id=" +
    tree.PID;

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
  }, [record, tree, t]);

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
        <div className="title-row">
          <h3>
            <img src="/images/searchIcon.png" alt="Record" style={{ width: 20, height: 20 }} />
            {record.title}
          </h3>
          <div className="counter counter--title">
            {t('status.complete') as string + ": " + hintsDone}
          </div>
        </div>
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
              setAttached={(attached: boolean) => {
                const temp = [...matches];
                temp[i].attached = attached;
                setMatches(temp);
              }}
              selectedCandidate={match.selectedCandidate}
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
        <div className="attach-buttons">
          <PixelButton
            i18nKey="buttons.attachAll"
            variant="match"
            size="lg"
            onClick={() => {
              submit(true);
              setLoading(true);
              setHintsDone(hintsDone + 1);
            }}
            disabled={!buttonsEnabled}
          />
          <span className="source-linker-inline">
            <NewWindowLink
              url={sourceLinkerURL}
              linkName={t('links.sourceLinker') as string}
              className="pixel-btn pixel-btn--neutral"
            />
          </span>
          <PixelButton
            i18nKey="buttons.skip"
            variant="notMatch"
            onClick={() => {
              submit(false);
              setLoading(true);
              setHintsDone(hintsDone + 1);
            }}
            disabled={!buttonsEnabled}
          />
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