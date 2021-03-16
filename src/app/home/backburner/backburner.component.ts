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
}
