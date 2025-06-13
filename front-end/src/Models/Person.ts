import FlexibleDate from "./FlexibleDate";

export default class Person {
  //Main info
  firstname?: string;
  firstnameUnique?: number;
  lastname?: string;
  lastnameUnique?: number;
  aliases?: Array<String>;
  sex?: string;
  PID?: string;

  //Relationship to focus person
  relationship?: Relationship; // focus, spouse, mother, father, brother, sister, child, other
  relationshipGroup?: RelationshipGroup; //focus & spouse, parents, siblings, children, other

  //Events
  birth?: Event;
  residences?: Array<Event>;
  otherInfo?: Array<Event>;
  death?: Event;

  constructor({
    PID,
    firstname,
    firstnameUnique,
    lastname,
    lastnameUnique,
    sex,
    relationship,
    relationshipGroup,
    birth,
    residences,
    otherInfo,
    death,
  }: {
    //Main info
    PID?: string;
    firstname?: string;
    firstnameUnique?: number;
    lastname?: string;
    lastnameUnique?: number;
    sex?: string;

    //Relationship to focus person
    relationship?: Relationship; // focus, spouse, mother, father, brother, sister, child, other
    relationshipGroup?: RelationshipGroup; //focus & spouse, parents, siblings, children, other

    //Events
    birth?: Event;
    residences?: Array<Event>; //all extra life info will be considered as an Event
    otherInfo?: Array<Event>; //all extra life info will be considered as an Event
    death?: Event;
  }) {
    this.PID = PID;
    this.firstname = firstname;
    this.firstnameUnique = firstnameUnique;
    this.lastname = lastname;
    this.lastnameUnique = lastnameUnique;
    this.sex = sex;
    this.relationship = relationship;
    this.relationshipGroup = relationshipGroup;
    this.birth = birth;
    this.residences = residences;
    this.otherInfo = otherInfo;
    this.death = death;
  }

  get personEvents() {
    let events = [];
    if (this.birth) events.push(this.birth);
    if (this.residences) events = events.concat(this.residences);
    if (this.otherInfo) events = events.concat(this.otherInfo);
    if (this.death) events.push(this.death);
    return events;
  }
}

export class Event {
  type?: string;
  location?: string;
  day?: number;
  month?: string;
  year?: number;

  //constructor in case we ever export Event
  constructor({
    type,
    location,
    day,
    month,
    year,
  }: Omit<Event, "date" | "sanitizedType">) {
    this.type = type;
    this.location = location;
    this.day = day;
    this.month = month;
    this.year = year;
  }

  get date() {
    const date = new FlexibleDate({
      likelyDay: this.day,
      likelyMonth: this.month,
      likelyYear: this.year,
    });
    if (!date.valueOf()) return undefined;
    return date;
  }

  get sanitizedType() {
    return this.type?.replaceAll(/[\s()]/g, "") || "undefined";
  }
}

export enum Relationship {
  //FocusPerson
  FocusPerson = "Focus",
  Spouse = "Spouse",
  //Parents
  Mother = "Mother",
  Father = "Father",
  //Siblings
  Sister = "Sister",
  Brother = "Brother",
  //Children
  Child = "Child",
  //Other
  Other = "Other",
}

export enum RelationshipGroup {
  FocusPerson,
  Parents,
  Siblings,
  Children,
  Other,
}
