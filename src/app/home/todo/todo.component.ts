import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Todo } from 'src/app/models/todo.model';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent implements OnInit, OnDestroy {
  todoSub: Subscription;
  todos: Todo[];
  backburners: Observable<any[]>;
  todo: Array<string> = [
    'Make my bed',
    'Take a shower',
    'Work on Project',
    'Make breakfast',
  ];
  backburner: Array<string> = ['Make a cake', 'Get COVID test', 'Wash car'];
  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.todoSub = this.todoService.getTodos().subscribe((todos) => {
      this.todos = todos;
    });
  }

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
    this.todos.push({ id: 'HAHA', todo: '', index: 1 });
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
    for (let i = 0; i < this.todos.length; i++) {
      if (this.todos[i] === task) {
        this.todos.splice(i, 1);
      }
    }
  }
  /**
   * Unsub from the todos
   */
  ngOnDestroy(): void {
    this.todoSub.unsubscribe();
  }
}
