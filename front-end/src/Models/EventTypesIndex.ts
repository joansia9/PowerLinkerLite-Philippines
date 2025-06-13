import FlexibleDate from "./FlexibleDate";
import { Event } from "./Person";

export class EventTypesIndexElement {
  recordEvent?: Event;
  treeEvent?: Event;

  get lowestDate() {
    if (this.recordEvent && this.treeEvent) {
      if ((this.recordEvent.date as FlexibleDate) < (this.treeEvent.date as FlexibleDate))
        return this.recordEvent.date;
      else return this.treeEvent.date;
    } else if (this.recordEvent) {
      return this.recordEvent.date;
    } else if (this.treeEvent) {
      return this.treeEvent.date;
    } else {
      throw new Error("This element contains no dates");
      // should be unreachable but including for typing reasons
    }
  }
}

export interface EventTypesIndex {
  [key: string]: EventTypesIndexElement;
}
