import Person from "../../Models/Person";
import {
  EventTypesIndex,
  EventTypesIndexElement,
} from "../../Models/EventTypesIndex";
import compareTwoDates from "../../Services/name-comparator/dateComparator.mjs";
import FlexibleDate from "../../Models/FlexibleDate";

//sorting events
export default function getSortedEventTypes(
  recordCandidate: Person, //single person, source person being compared against
  treeCandidates: Person[], //array of people, potential matches already in someone's tree
  selectedCandidate: number | undefined
): [string, string][] {
  const treeCandidate = //(2) selects person
    selectedCandidate !== undefined // (1) checks if selected
      ? treeCandidates[selectedCandidate]
      : undefined; //(3) sets person to undefined if no selection has been made

  const eventsTypeIndex = getEventsIndexedByType(
    recordCandidate,
    treeCandidate
  );
  const sortedEventTypes = sortEventTypes(eventsTypeIndex);
  const matchedEventTypes = matchEventTypes(
    sortedEventTypes,
    recordCandidate,
    treeCandidate
  );
  return matchedEventTypes;
}

//helper: getting event TYPE
function getEventsIndexedByType(
  recordCandidate: Person,
  treeCandidate?: Person
) {
  const eventsIndex: EventTypesIndex = {}; //dict

  //remember personEvents = array of events
  for (const event of recordCandidate.personEvents) { 
    if (!eventsIndex[event.sanitizedType])
      eventsIndex[event.sanitizedType] = new EventTypesIndexElement();
    if (
      !eventsIndex[event.sanitizedType].recordEvent ||
      (eventsIndex[event.sanitizedType].treeEvent?.date as FlexibleDate).getTime() >
        (event.date as FlexibleDate).getTime() //gets earliest event date
    )
      eventsIndex[event.sanitizedType].recordEvent = event; //either marriage death etc
  }

  for (const event of treeCandidate?.personEvents || []) {
    if (!eventsIndex[event.sanitizedType])
      eventsIndex[event.sanitizedType] = new EventTypesIndexElement();
    if (
      eventsIndex[event.sanitizedType].treeEvent?.date === undefined ||
      (eventsIndex[event.sanitizedType].treeEvent?.date as FlexibleDate).getTime() >
        (event.date as FlexibleDate).getTime()
    )
      eventsIndex[event.sanitizedType].treeEvent = event;
  }
  return eventsIndex;
}

//helper: sorting event types
function sortEventTypes(eventTypesIndex: EventTypesIndex) {
  return Object.keys(eventTypesIndex).sort((key1, key2) => {
    const value1 = eventTypesIndex[key1];
    const value2 = eventTypesIndex[key2];

    const value1HasBoth = !!(value1.recordEvent && value1.treeEvent);
    const value2HasBoth = !!(value2.recordEvent && value2.treeEvent);
    // They must have at least one
    if (value1HasBoth !== value2HasBoth)
      return Number(value2HasBoth) - Number(value1HasBoth);
    if (
      (value1.lowestDate?.getTime() as number) <
      (value2.lowestDate?.getTime() as number)
    ) {
      return -1;
    }
    if (
      (value1.lowestDate?.getTime() as number) >
      (value2.lowestDate?.getTime() as number)
    ) {
      return 1;
    }
    return 0;
  });
}

//helper: record’s event date and tree’s event date.
function matchEventTypes(
  eventTypeList: string[],
  recordCandidate: Person,
  treeCandidate?: Person
): [string, string][] {
  return eventTypeList.map((eventType) => {
    if (!treeCandidate) return [eventType, 'is-undetermined'];
    const recordEventsOfType = recordCandidate.personEvents.filter(
      (event) => event.sanitizedType === eventType
    );
    const treeEventsOfType = treeCandidate.personEvents.filter(
      (event) => event.sanitizedType === eventType
    );

    //Extract the record’s event date and tree’s event date.
    const recordDate = recordEventsOfType[0].date?.toDateString() || "";
    const treeDate = treeEventsOfType[0].date?.toDateString() || "";
     
    // const matchData = compareTwoStrings(
    //   recordDate,
    //   treeDate
    // );
    const matchData = compareTwoDates(
      new Date(recordDate),
      new Date(treeDate), 
      'rules'
    );
    
    // Simple match classification based on date comparison
    let matchClass = 'is-undetermined';
    if (matchData[1] === 2) { // Strong match
      matchClass = 'is-match';
    } else if (matchData[1] === -1) { // Not a match
      matchClass = 'is-not-match';
    }

    return [eventType, matchClass];
  });
}
