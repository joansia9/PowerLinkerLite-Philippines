import Person from "./Person";


export class Record {

    //the ARK from which we get all this info
    ARK?: string;
    //US Social Security, Numerical Identification (Numident)
    title?: string; //from FAMILYSEARCH
    //Relevant people from the record
    people?: Array<Person>; //from FAMILYSEARCH

    //Pending data members
    // URL?: string;
    // imageURL?: string;
  
    constructor({
      ARK,
      title,
      people,

    }: {
      ARK?: string;
      title?: string;
      people?: Array<Person>;
    }) {
      this.ARK = ARK;
      this.title = title;
      this.people = people;
    }
  }