/**
 * Allows for Dates that may be missing a day, a month, or both.
 * 
 * @param {number} likelyDay - The day of the month (optional).
 * @param {string} likelyMonth - The abbreviated month name (e.g., "Jan", "Feb") (optional).
 * @param {number} likelyYear - The year (optional).
 * @returns {FlexibleDate} - The date object.
 */
export default class FlexibleDate {
    likelyDay?: number;
    likelyMonth?: string;
    likelyYear?: number;
  
    constructor({
      likelyDay,
      likelyMonth,
      likelyYear,
    }: {
      likelyDay?: number;
      likelyMonth?: string;
      likelyYear?: number;
    }) {
      this.likelyDay = likelyDay;
      this.likelyMonth = likelyMonth;
      this.likelyYear = likelyYear;
    }
  
    private monthMap: { [key: string]: string } = {
      "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", "May": "05", "Jun": "06",
      "Jul": "07", "Aug": "08", "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12"
    };
  
    private getMonthNumber(month: string): string {
      return this.monthMap[month] || '';
    }
  
    public toDateString(): string {
      let dateString = "";
    
      if (this.likelyMonth) {
        dateString += this.likelyMonth + " ";
      }
    
      if (this.likelyDay !== undefined) {
        dateString += this.likelyDay.toString() + " ";
      }
    
      if (this.likelyYear !== undefined) {
        dateString += this.likelyYear.toString();
      }
    
      // Trim any trailing spaces and return the resulting string
      return dateString.trim();
    }
    
  
    public getTime(): number {
      const defaultYear = 1970;
      const defaultMonth = "Jan";
      const defaultDay = 1;
  
      // Use default values if any component is undefined
      const year = this.likelyYear !== undefined ? this.likelyYear : defaultYear;
      const month = this.likelyMonth !== undefined ? this.likelyMonth : defaultMonth;
      const day = this.likelyDay !== undefined ? this.likelyDay : defaultDay;
  
      const monthNumber = this.getMonthNumber(month);
      const dateString = `${year}-${monthNumber}-${day}`;
      return new Date(dateString).getTime();
    }
  }
  