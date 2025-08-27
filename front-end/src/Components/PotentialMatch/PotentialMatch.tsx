import "./PotentialMatch.css";
import Person, { Relationship } from "../../Models/Person";

import MatchTable from "../MatchTable/MatchTable";
import NewWindowLink from "../NewWindowLink/NewWindowLink";

//TODO: changing the fields to the translated fields based on the user choice
//FIXME: hello
//1. use the enum value as a translation key
import { useTranslation } from 'react-i18next';

/* Defines comparison table component which has two iterations:
  1.) One person is being compared to one other (yes/no question)
  2.) One person has multiple possible options (matching question, can also add an entirely new person) */

export function PotentialMatch({
  recordCandidate,
  treeCandidates,
  setAttached,
  selectedCandidate,
  createPerson,
  ark,
  pid,
}: {
  recordCandidate: Person;
  treeCandidates: Person[];
  setAttached: (attached: boolean) => void;
  selectedCandidate: number | undefined;
  createPerson: () => void;
  ark: string | undefined;
  pid: string | undefined;
})  {
  const { t } = useTranslation();
  let sourceLinkerURL: string = "https://www.familysearch.org/search/linker?pal=/ark:/61903/1:1:" + ark + "&id=" + pid;

  return (
    <div className="potential-match">
      <div className="relationship-headers">
        <h4>
          {t(`relationship.${recordCandidate.relationship}`) as string}
        </h4>
        <h4>
          {t(`relationship.${(selectedCandidate !== undefined && treeCandidates[selectedCandidate]?.relationship) || recordCandidate.relationship}`) as string}
        </h4>
      </div>
      <div className="flex-row">
        <MatchTable
          selectedCandidate={selectedCandidate}
          recordCandidate={recordCandidate}
          treeCandidates={treeCandidates}
          createPerson={createPerson}
          setAttached={setAttached}
        />
      </div>
    </div>
  );
}
