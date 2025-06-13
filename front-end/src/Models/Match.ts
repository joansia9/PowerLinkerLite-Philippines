import Person from "./Person";

export default interface Match {
  recordPerson: Person;
  treePeople: Person[];
  attached?: boolean;
  selectedCandidate?: number;
}
