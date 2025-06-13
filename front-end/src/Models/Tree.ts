import Person from "./Person";


export class Tree {

  //the PID from which we get all this info
  PID?: string;
  //Related persons from the tree (People from ARK)
  people?: Array<Person> //from FAMILYSEARCH

  constructor({
    PID,
    people,

  }: {
    PID?: string;
    people?: Array<Person>;
  }) {
    this.PID = PID;
    this.people = people;
  }
}