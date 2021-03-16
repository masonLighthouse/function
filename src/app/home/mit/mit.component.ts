import { stringify } from "@angular/compiler/src/util";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-mit",
  templateUrl: "./mit.component.html",
  styleUrls: ["./mit.component.scss"],
})
export class MitComponent implements OnInit {
  mit: string = "Write the MIT here";
  mitDate: string;
  date: Date = new Date();
  currentDate: Array<any> = [];
  monthNames = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  };
  dayNames = {
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
    7: "Sunday",
  };
  constructor() {}
  /**
   * Make the date format and set it right
   */
  ngOnInit() {
    this.currentDate.push(this.date.getUTCMonth());
    this.currentDate.push(this.date.getUTCDay());
    this.currentDate.push(this.date.getUTCFullYear());
    console.log(this.currentDate);
    this.mitDate = `${this.dayNames[this.currentDate[1]]}, ${
      this.monthNames[this.currentDate[0]]
    } ${this.currentDate[1]}${this.determineSuffix()}, ${this.currentDate[2]}`;
  }
  /**
   * Determine the right suffix for the date
   * @returns {string}
   */
  determineSuffix(): string {
    // determine the suffix based on the dictionary
    switch (this.currentDate[1]) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }
}
