import { useMemo, useState, useEffect } from "react";
import Person from "../../Models/Person";
// Collapsible removed; events are always visible
import getSortedEventTypes from "../PotentialMatch/EventIndex";
//Before: import loadNameComparator from "../../Services/name-comparator/nameComparisonLoader";
//we were always loading the nameComparator
import loadNameComparator, { isNameComparatorLoaded, preloadNameComparator } from "../../Services/name-comparator/nameComparisonLoader";
import { useTranslation } from 'react-i18next';

//TODO: dynamic loading
//1. remove static import
//2. load when needed
//3. use conditionally

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
  createPerson: () => void;
  setAttached: (attached: boolean) => void;
}) {
  const { t } = useTranslation();
  // Details are always shown
  //holds the dynamically loaded name comparison function
  //before: import compareTwoNames from "./nameComparator.mjs"; //nameComparator loaded immediately
  const [nameComparator, setNameComparator] = useState<((fullName1: string, fullName2: string) => [boolean, number, [number, number, number][]]) | null>(null);
    //Returns
    //boolean -> if they match or not
    //number -> match quality/reqsoning (strong pronounciation match 2 vs not so much -2)
    //[number, number, number][] - Word-by-word comparison breakdown
  
  //Keeps track of whether the name comparator is currently loading
  const [isLoadingComparator, setIsLoadingComparator] = useState(false);
  //handles loading errors
  const [loadError, setLoadError] = useState<string | null>(null);

  // Check if we need name comparison
  const needsNameComparison = useMemo(() => {
    const recordName = (recordCandidate.firstname || "") + " " + (recordCandidate.lastname || "");
    let treeName = "";
    
    if (selectedCandidate === -1) {
      treeName = recordName; // Same as record candidate
    } else if (selectedCandidate !== undefined && treeCandidates[selectedCandidate]) {
      treeName = (treeCandidates[selectedCandidate].firstname || "") + " " + (treeCandidates[selectedCandidate].lastname || "");
    }
    
    return recordName.trim() !== "" && treeName.trim() !== "" && selectedCandidate !== undefined;
  }, [recordCandidate, treeCandidates, selectedCandidate]);

  // Preload name comparator on component mount for better UX
  useEffect(() => {
    preloadNameComparator();
  }, []);

  // Load name comparator only when needed (dynamic loading implementation!)
  useEffect(() => {
    const loadComparator = async () => {
      // Skip loading if not needed or already loaded/loading
      if (!needsNameComparison || nameComparator || isLoadingComparator) return;
      
      // Check if already loaded from cache
      if (isNameComparatorLoaded()) {
        const loadedComparator = await loadNameComparator(); 
        setNameComparator(() => loadedComparator);
        return;
      }
      
      setIsLoadingComparator(true);
      setLoadError(null);
      
      try {
        const loadedComparator = await loadNameComparator();
        setNameComparator(() => loadedComparator);
      } catch (error) {
        console.error('Failed to load name comparator:', error);
        setLoadError('Failed to load name comparison functionality');
      } finally {
        setIsLoadingComparator(false);
      }
    };
    
    loadComparator();
  }, [needsNameComparison, nameComparator, isLoadingComparator]);

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

  // const recordName = recordCandidate.firstname + " " + recordCandidate.lastname
  // const treeName = treeCandidate?.firstname + " " + treeCandidate?.lastname

  //this can handle nulls
  const recordName = (recordCandidate.firstname || "") + " " + (recordCandidate.lastname || "");
  const treeName = (treeCandidate?.firstname || "") + " " + (treeCandidate?.lastname || "");

  //now we should call when we have actual names!
  // const matchData = compareTwoStrings(
  //   recordName,
  //   treeName
  // )

  const matchData: [boolean, number, [number, number, number][]] = useMemo(() => {
    // If comparator is loading or failed, return default
    if (isLoadingComparator || loadError || !nameComparator) {
      return [false, -1, []];
    }
    
    // If we have valid names and loaded comparator, compare them
    if (recordName.trim() && treeName.trim()) {
      return nameComparator(recordName, treeName);
    }
    
    // Default case
    return [false, -1, []];
  }, [recordName, treeName, nameComparator, isLoadingComparator, loadError]);

  // Simplified match classification for visual bars
  const matchClass = useMemo(() => {
    if (!matchData || matchData[2].length === 0) return 'is-undetermined';
    const averageScore = matchData[2].reduce((sum, match) => sum + match[2], 0) / matchData[2].length;
    
    if (averageScore > 95 || matchData[0]) {
      return 'is-match';
    } else if (averageScore > 65) {
      return 'is-undetermined';
    } else {
      return 'is-not-match';
    }
  }, [matchData]);

  return (
    <div className="potential-match-table">
      {isLoadingComparator && (
        <div className="loading-indicator" style={{ 
          background: '#f0f0f0', 
          padding: '4px 8px', 
          fontSize: '12px', 
          textAlign: 'center',
          borderRadius: '4px',
          marginBottom: '8px'
        }}>
          🔄 Loading name comparison...
        </div>
      )}
      {loadError && (
        <div className="error-indicator" style={{ 
          background: '#ffe6e6', 
          padding: '4px 8px', 
          fontSize: '12px', 
          textAlign: 'center',
          borderRadius: '4px',
          marginBottom: '8px',
          color: '#d00'
        }}>
          ⚠️ {loadError}
        </div>
      )}
      <button
        type="button"
        className={`header-button reset ${matchClass}`}
      >
        <MatchHeader
          candidate={recordCandidate}
          fromRecord={true}
        />
      </button>
      {treeCandidate ? (
        <button
          type="button"
          className={`header-button reset ${matchClass}`}
        >
          <MatchHeader
            candidate={treeCandidate}
            fromRecord={false}
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
          {t('home.createNew') as string}
        </button>
      )}

      {detailsToShow && (
        <div className="details-wrapper">
          <div
            className="details-grid"
            style={{
              gridTemplateRows:
                `[` +
                eventTypes.map(([eventType]) => eventType).join(`] auto [`) +
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
        </div>
      )}
    </div>
  );

  function MatchDetails({ candidate }: { candidate: Person }) {
    return (
      <div className="potential-match-details">
        {eventTypes?.map(([eventType, eventMatchClass]) => {
          const eventsOfType = candidate.personEvents.filter(
            (event) => event.sanitizedType === eventType
          ); // TODO handle multiple events of one type

          return (
            <>
              {eventsOfType.length > 0 &&
                eventsOfType.map((event, j) => (
                  <div
                    className="event-type-wrapper"
                    style={{ gridRowStart: eventType as any }}
                    key={eventType + j}
                  >
                    <button
                      type="button"
                      className={`header-button reset event-entry ${eventMatchClass}`}
                    >
                      <div className="event-title" style={{margin: 0}}>
                         {t(`event.${event.type?.toLowerCase() || 'unknown'}`) as string}
                       </div>
                         <div className="event-panel__body" style={{padding: 'var(--header-padding)'}}>
                        {(() => {
                          const eventType = (event.type || "").toString().toLowerCase();
                          let icon = "";
                          if (eventType === "birth" || eventType === "nacimiento") icon = "/newCSSIcons/birthdayIcon.png";
                          else if (eventType === "death" || eventType === "fallecimiento") icon = "/newCSSIcons/deathIcon.png";
                          return icon ? (
                            <img className="event-icon" src={icon} alt={eventType} />
                          ) : null;
                        })()}
                        <div className="event-details" style={{display:'grid', gap:'0.125rem'}}>
                          <div className="date">
                            {event.date?.toDateString()}
                          </div>
                          <div className="location">{event.location}</div>
                        </div>
                      </div>
                    </button>

                  </div>
                ))}
            </>
          );
        })}
      </div>
    );
  }
}

export function MatchHeader({
  candidate,
  fromRecord
}: {
  candidate: Person;
  fromRecord: boolean;
}) {
  const imageSrc: string =
    candidate.sex === "Female"
      ? "/images/motherIcon.png"
      : candidate.sex === "Male"
      ? "/images/fatherIcon.png"
      : "/images/searchIcon.png";

  return (
    <div className={"potential-match-header"}>
      <h5 className="">
        <span>
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
      <img src={imageSrc} alt={candidate.sex} className="person-icon" />
    </div>
  );
}
