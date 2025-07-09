import Person from "../../Models/Person";
import getHighlightType from "../../Services/getHighlightType";
import {
  EventTypesIndex,
  EventTypesIndexElement,
} from "../../Models/EventTypesIndex";
import compareTwoDates from "../../Services/name-comparator/dateComparator.mjs";
import { HighlightType  } from "../../Models/HighlightType"
import FlexibleDate from "../../Models/FlexibleDate";

export default function getSortedEventTypes(
  recordCandidate: Person,
  treeCandidates: Person[],
  selectedCandidate: number | undefined
): [string, number][] {
  const treeCandidate =
    selectedCandidate !== undefined
      ? treeCandidates[selectedCandidate]
      : undefined;

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

function getEventsIndexedByType(
  recordCandidate: Person,
  treeCandidate?: Person
) {
  const eventsIndex: EventTypesIndex = {};

  for (const event of recordCandidate.personEvents) {
    if (!eventsIndex[event.sanitizedType])
      eventsIndex[event.sanitizedType] = new EventTypesIndexElement();
    if (
      !eventsIndex[event.sanitizedType].recordEvent ||
      (eventsIndex[event.sanitizedType].treeEvent?.date as FlexibleDate).getTime() >
        (event.date as FlexibleDate).getTime()
    )
      eventsIndex[event.sanitizedType].recordEvent = event;
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

function matchEventTypes(
  eventTypeList: string[],
  recordCandidate: Person,
  treeCandidate?: Person
): [string, number][] {
  return eventTypeList.map((eventType) => {
    if (!treeCandidate) return [eventType, HighlightType.None] as [string, number];
    const recordEventsOfType = recordCandidate.personEvents.filter(
      (event) => event.sanitizedType === eventType
    );
    const treeEventsOfType = treeCandidate.personEvents.filter(
      (event) => event.sanitizedType === eventType
    );

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
    
    const highlightType = getHighlightType(
      recordDate,
      treeDate,
      matchData,
      "date"
    )

    return [eventType, highlightType] as [string, number];
  });
}
