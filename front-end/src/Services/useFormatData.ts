import { useEffect } from "react";
import { Record } from "../Models/Record";
import Person, { Event, Relationship } from "../Models/Person";
import NumidentHint from "../Models/NumidentHint";
import { Tree } from "../Models/Tree";

export default function useFormatData({
  data,
  setRecord,
  setTree,
}: {
  data: (NumidentHint | Error)[];
  setRecord: Function;
  setTree: Function;
}) {
  useEffect(() => {
    if (!data || data.length < 1) return;
    if (typeof data === "string") return;

    const firstHint = data[0];
    if (firstHint instanceof Error) return;
    setRecord(
      new Record({
        ARK: firstHint.ark,
        title: firstHint.batchID,
        people: [
          new Person({
            firstname: firstHint.pr_name_gn,
            firstnameUnique: firstHint.pr_name_gn_unique,
            lastname: firstHint.pr_name_surn,
            lastnameUnique: firstHint.pr_name_surn_unique,
            birth: new Event({
              type: "birth",
              location: firstHint.pr_bir_place,
              ...dateToEventDate(firstHint.pr_bir_date),
            }),
            death: new Event({
              type: "death",
              ...dateToEventDate(firstHint.pr_dea_date),
            }),
            relationship: Relationship.FocusPerson,
          }),
          new Person({
            firstname: firstHint.pr_fthr_name_gn,
            firstnameUnique: firstHint.pr_fthr_name_gn_unique,
            lastname: firstHint.pr_fthr_name_surn,
            lastnameUnique: firstHint.pr_fthr_name_surn_unique,
            sex: "Male",
            relationship: Relationship.Father,
          }),
          new Person({
            firstname: firstHint.pr_mthr_name_gn,
            firstnameUnique: firstHint.pr_mthr_name_gn_unique,
            lastname: firstHint.pr_mthr_name_surn,
            lastnameUnique: firstHint.pr_mthr_name_surn_unique,
            sex: "Female",
            relationship: Relationship.Mother,
          }),
        ],
      })
    );
    setTree(
      new Tree({
        PID: firstHint.pid,
        people: [
          new Person({
            firstname: firstHint.givenname,
            lastname: firstHint.surname,
            birth: new Event({
              type: "birth",
              location: firstHint.birthplace,
              ...dateToEventDate(firstHint.birthdate),
            }),
            death: new Event({
              type: "death",
              ...dateToEventDate(firstHint.deathdate),
            }),
            relationship: Relationship.FocusPerson,
          }),
          new Person({
            firstname: firstHint.father_givenname,
            lastname: firstHint.father_surname,
            sex: "Male",
            relationship: Relationship.Father,
          }),
          new Person({
            firstname: firstHint.mother_givenname,
            lastname: firstHint.mother_surname,
            sex: "Female",
            relationship: Relationship.Mother,
          }),
        ],
      })
    );

    function dateToEventDate(date: string) {
      const fullDatePattern = /^(\d{1,2})[-\s]([a-zA-Z]{3,9})[-\s](\d{2}|\d{4})$/;
      const monthYearPattern = /^([a-zA-Z]{3,9})[-\s](\d{2}|\d{4})$/;
      const yearPattern = /^(\d{2}|\d{4})$/;

      const validMonths = new Set([
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ]);

      function getMonthAbbreviation(month: string): string {
        const monthAbbreviation = month.substring(0, 3);
        return validMonths.has(monthAbbreviation) ? monthAbbreviation : month;
      }

      if (yearPattern.test(date)) {
        return {
          year: parseInt(date,10),
        };
      } else if (monthYearPattern.test(date)) {
        const match = date.match(monthYearPattern);
        if (match) {
          const [, month, year] = match;
          return {
            month: getMonthAbbreviation(month), // Get the first 3 letters of the month
            year: parseInt(year,10),
          };
        }
      } else if (fullDatePattern.test(date)) {
        const match = date.match(fullDatePattern);
        if (match) {
          const [, day, month, year] = match;
          return {
            day: parseInt(day, 10), // Ensures the day is parsed as a decimal number
            month: getMonthAbbreviation(month), // Get the first 3 letters of the month
            year: parseInt(year,10),
          };
        }
      }
    }
  }, [data, setRecord, setTree]);
}
