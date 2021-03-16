import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-backburner",
  templateUrl: "./backburner.component.html",
  styleUrls: ["./backburner.component.scss"],
})
export class BackburnerComponent implements OnInit {
  data: Array<string> = ["Make my bed", "Take a shower", "Work on Project"];
  constructor() {}

  ngOnInit() {}
  /**
   * Deletes a task from the task array
   * @param task
   */
  delete(task: string) {
    console.log(task);
  }
  /**
   * Marks a task as done
   * @param task
   */
  done(task: string) {
    console.log(task);
  }
}
