import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent {
  todo: Array<string> = [
    'Make my bed',
    'Take a shower',
    'Work on Project',
    'Make breakfast',
  ];
  backburner: Array<string> = ['Make a cake', 'Get COVID test', 'Wash car'];
  constructor() {}

  /**
   * @param task
   * Deletes a task from the task array
   */
  delete(task: string): void {
    console.log(task);
  }
  /**
   * @param task
   * Marks a task as done
   */
  done(task: string): void {
    console.log(task);
  }
  /**
   * @param event
   * Handle drag and drop events
   */
  drop(event: CdkDragDrop<string[]>): void {
    console.log('event: ', event);
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
   * Add an element to the todo list
   */
  todoAppend(): void {
    this.todo.push('');
  }
  /**
   * Add an element to the backburner list
   */
  backburnerAppend(): void {
    this.backburner.push('');
  }
  /**
   * @param task
   * Deletes an item from an array based on the string in the array
   */
  deleteItem(task: string): void {
    for (let i = 0; i < this.todo.length; i++) {
      if (this.todo[i] === task) {
        this.todo.splice(i, 1);
      }
    }
  }
}
