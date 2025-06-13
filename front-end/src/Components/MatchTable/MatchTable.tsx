import { useMemo, useState } from "react";
import Person from "../../Models/Person";
import Collapsible from "../Collapsible/Collapsible";
import RecordSVG from "../svg/RecordSVG";
import getSortedEventTypes from "../PotentialMatch/EventIndex";
import compareTwoStrings from "../../Services/name-comparator";
import getHighlightType from "../../Services/getHighlightType";
import { HighlightType } from "../../Models/HighlightType";

export default function MatchTable({
  selectedCandidate,
  recordCandidate,
  treeCandidates,
  createPerson,
  setAttached,
}: {
  selectedCandidate: number | undefined;
  recordCandidate: Person;
  treeCandidates: Person[];
  createPerson: Function;
  setAttached: Function;
}) {
  const [showDetails, setShowDetails]: [boolean, Function] = useState(true);
  const treeCandidate = useMemo(() => {
    if (selectedCandidate === -1) {
      return recordCandidate;
    }
    if (selectedCandidate !== undefined) {
      return treeCandidates[selectedCandidate];
    } else {
      return undefined;
    }
  }, [recordCandidate, treeCandidates, selectedCandidate]);
  const eventTypes = useMemo(
    () =>
      getSortedEventTypes(recordCandidate, treeCandidates, selectedCandidate),
    [recordCandidate, treeCandidates, selectedCandidate]
  );
  const detailsToShow = useMemo(() => {
    if (selectedCandidate === undefined) return false;
    if (recordCandidate.personEvents.length) return true;
    if (
      selectedCandidate >= 0 &&
      treeCandidates[selectedCandidate].personEvents.length
    )
      return true;
    return false;
  }, [recordCandidate, treeCandidates, selectedCandidate]);

  const recordName = recordCandidate.firstname + " " + recordCandidate.lastname
  const treeName = treeCandidate?.firstname + " " + treeCandidate?.lastname

  const matchData = compareTwoStrings(
    recordName,
    treeName
  )

  const highlightType = getHighlightType(
    recordName,
    treeName,
    matchData,
    "name"
  )

  return (
    <div className="potential-match-table">
      <button
        type="button"
        className="header-button reset"
        onClick={() => {
          if (selectedCandidate !== undefined) setShowDetails(!showDetails);
        }}
      >
        <MatchHeader
          candidate={recordCandidate}
          fromRecord={true}
          highlightType={highlightType}
        />
      </button>
      {treeCandidate ? (
        <button
          type="button"
          className="header-button reset"
          onClick={() => setShowDetails(!showDetails)}
        >
          <MatchHeader
            candidate={treeCandidate}
            fromRecord={false}
            highlightType={highlightType}
          />
        </button>
      ) : (
        <button
          className="header-button create-new-person"
          onClick={() => {
            createPerson();
            setAttached(true);
          }}
        >
          Create New
        </button>
      )}

      {detailsToShow && (
        <div className="details-wrapper">
          <Collapsible open={showDetails}>
            <div
              className="details-grid"
              style={{
                gridTemplateRows:
                  `[` +
                  eventTypes.map((type) => type[0]).join(`] auto [`) +
                  `]`,
              }}
            >
              <MatchDetails candidate={recordCandidate} />
              {/* Family tree person table half:
                If there is only one link option, display that option.
                If there is multiple link options, display the selected option
                If there is not a selected option, display a "Create New" box/button. */}
              {selectedCandidate !== undefined ? (
                <MatchDetails candidate={treeCandidates[selectedCandidate]} />
              ) : (
                <></>
              )}
            </div>
          </Collapsible>
          <button
            className="toggle-details reset"
            onClick={() => {
              if (selectedCandidate !== undefined) setShowDetails(!showDetails);
            }}
            type="button"
          >
            {showDetails ? "Hide Events" : "Show Events"}
          </button>
        </div>
      )}
    </div>
  );

  function MatchDetails({ candidate }: { candidate: Person }) {
    return (
      <div className="potential-match-details">
        {eventTypes?.map(([eventType, highlightType]) => {
          const eventsOfType = candidate.personEvents.filter(
            (event) => event.sanitizedType === eventType
          ); // TODO handle multiple events of one type

          return (
            <div
              className="event-type-wrapper"
              style={{ gridRowStart: eventType }}
              key={eventType}
            >
              {eventsOfType.length > 0 &&
                eventsOfType.map((event, j) => (
                  <div className="detail" key={eventType + j}>
                    <h6>{event.type}</h6>

                    <div className={"date " + (highlightType === HighlightType.Green ? "data-matches" : highlightType === HighlightType.Red ? "data-not-matches" : "")}>
                      {" "}
                      {event.date?.toDateString()}
                    </div>

                    <div className="location"> {event.location}</div>
                  </div>
                ))}
            </div>
          );
        })}
      </div>
    );
  }
}

export function MatchHeader({
  candidate,
  fromRecord,
  highlightType
}: {
  candidate: Person;
  fromRecord: boolean;
  highlightType : number;
}) {
  let imageUrl, imageColor;
  if (candidate.sex === "Male") {
    imageUrl = "/images/male.svg";
    imageColor = "var(--color-sex-male)";
  } else if (candidate.sex === "Female") {
    imageUrl = "/images/female.svg";
    imageColor = "var(--color-sex-female)";
  } else {
    imageUrl = "images/undetermined_sex.svg";
    imageColor = "var(--color-sex-undetermined)";
  }

  return (
    <div className={"potential-match-header"}>


      <h5 className={highlightType === HighlightType.Green ? "data-matches" :  (highlightType === HighlightType.Red) ? "data-not-matches" : ""}>
        <span> {/*check if female and if firstnames exist and if className="", then apply data-matches*/}
          {candidate.firstname}
        </span>
        {" "}
        <span>
          {candidate.lastname}
        </span>
      </h5>

      <span className="lifespan">
        {candidate.birth?.year || "?"} - {candidate.death?.year || "?"}
      </span>
      <span className="pid">{candidate.PID}</span>
      {fromRecord ? (
        <RecordSVG alt={candidate.sex} style={{ color: imageColor }} />
      ) : (
        <img src={imageUrl} alt={candidate.sex} className="person-icon" />
      )}
    </div>
  );
}
