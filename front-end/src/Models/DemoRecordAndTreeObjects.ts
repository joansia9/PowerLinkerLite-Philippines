import { Record } from "./Record";
import { Tree } from "./Tree";
import Person, { Event, Relationship, RelationshipGroup } from "./Person";

export const demoRecord = new Record({
  ARK: "6K4Z-Q5RC",
  title:
    "United States, Social Security Numerical Identification Files (NUMIDENT), 1936-2007",
  people: [
    new Person({
      firstname: "Gertrude",
      lastname: "Kitt",
      sex: "Female",
      relationship: Relationship.FocusPerson,
      relationshipGroup: RelationshipGroup.FocusPerson,
      birth: new Event({
        type: "birth",
        location: "Montross Wes*, Virginia, United States",
        day: 4,
        month: "Aug",
        year: 1923,
      }),
      death: new Event({
        type: "death",
        year: 1993,
        month: "Oct",
      }),
      otherInfo: [
        new Event({
          type: "Other (PreviousResidence)",
          location: "Baltimore, Baltimore, Maryland, United States",
        }),
        new Event({
          type: "Other (PreviousResidence)",
          location: "Detroit, Detroit, Michigan, United States",
        }),
        new Event({
          type: "Other (SocialProgramApplication)",
          year: 1949,
          month: "Jun",
        }),
      ],
    }),
    new Person({
      firstname: "Annie",
      lastname: "Thompson",
      sex: "Female",
      relationship: Relationship.Mother,
      relationshipGroup: RelationshipGroup.Parents,
    }),
    new Person({
      firstname: "Leroy",
      lastname: "Lucas",
      sex: "Male",
      relationship: Relationship.Father,
      relationshipGroup: RelationshipGroup.Parents,
    }),
  ],
});

export const demoTree = new Tree({
  PID: "G3YX-2GW",
  people: [
    new Person({
      PID: "G3YX-2GW",
      firstname: "Gertrude",
      lastname: "Lucas",
      sex: "Female",
      relationship: Relationship.FocusPerson,
      relationshipGroup: RelationshipGroup.FocusPerson,
      birth: new Event({
        type: "birth",
        location: "Virginia, United States",
        year: 1924,
      }),
      death: new Event({
        type: "death",
        year: 0, //should place this here as Deceased?
      }),
      residences: [
        new Event({
          type: "residence",
          location: "Farnham, Richmond County, Virginia, United States",
          year: 1930,
        }),
      ],
    }),
    new Person({
      firstname: "Nancy",
      lastname: "Thompson",
      sex: "Female",
      PID: "G3YX-2LJ",
      relationship: Relationship.Mother,
      relationshipGroup: RelationshipGroup.Parents,
      birth: new Event({
        type: "birth",
        location: "Virginia, United States",
        year: 1892,
      }),
      death: new Event({
        type: "death",
        year: 0, //should place this here as Deceased?
      }),
      residences: [
        new Event({
          type: "residence",
          location: "Farnham, Richmond County, Virginia, United States",
          year: 1930,
        }),
      ],
    }),
    new Person({
      firstname: "Leroy",
      lastname: "Lucas",
      sex: "Male",
      PID: "GS2H-8BW",
      relationship: Relationship.Father,
      relationshipGroup: RelationshipGroup.Parents,
      birth: new Event({
        type: "birth",
        location: "Virginia, United States",
        year: 1881,
      }),
      death: new Event({
        type: "death",
        year: 0, //should place this here as Deceased?
      }),
      residences: [
        new Event({
          type: "residence",
          location: "Farnham, Richmond County, Virginia, United States",
          year: 1930,
        }),
      ],
    }),
  ],
});
