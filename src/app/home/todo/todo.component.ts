import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-todo",
  templateUrl: "./todo.component.html",
  styleUrls: ["./todo.component.scss"],
})
export class TodoComponent implements OnInit {
  todo: Array<string> = ["Make my bed", "Take a shower", "Work on Project"];
  backburner: Array<string> = ["Make a cake", "Get COVID test", "Wash car"];
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
  /**
   * Handle drag and drop events
   * @param event
   */
  drop(event: CdkDragDrop<string[]>) {
    console.log("event: ", event);
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
  /**
   * Long Press Shit
   */
  pressed() {
    console.log("press");
  }

  active() {
    console.log("active");
  }

  released() {
    console.log("release");
  }
  /**
   * Add an element to the todo list
   */
  todoAppend(): void {
    this.todo.push("");
  }
  /**
   * Add an element to the backburner list
   */
  backburnerAppend(): void {
    this.backburner.push("");
  }
  /**
   * Deletes an item from an array based on the string in the array
   * @param task 
   */
  deleteItem(task: string): void {
    for (let i = 0; i < this.todo.length; i++) {
      if (this.todo[i] === task) {
        this.todo.splice(i, 1);
      }
    }
  }
}
