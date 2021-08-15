import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Todo } from 'src/app/models/todo.model';
import { TodoService } from 'src/app/services/todo.service';
import { Backburner } from 'src/app/models/backburner.model';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent implements OnInit, OnDestroy {
  todoSub: Subscription;
  backburnersSub: Subscription;
  todos: Todo[];
  backburners: Backburner[];
  live = false;
  constructor(private todoService: TodoService) {}
  /**
   *
   */
  ngOnInit(): void {
    this.subscribeToObservables();
  }
  /**
   * Subscribe!
   */
  subscribeToObservables() {
    this.live = true;
    this.todoSub = this.todoService.getTodos('todos').subscribe((todos) => {
      this.todos = todos;
    });
    this.backburnersSub = this.todoService
      .getTodos('backburners')
      .subscribe((backburners) => {
        this.backburners = backburners;
      });
  }
  /**
   * Focusing unsubscribes
   */
  todoFocus(): void {
    this.live = false;
    this.todoSub.unsubscribe();
    this.backburnersSub.unsubscribe();
  }
  backburnerFocus(): void {
    this.live = false;
    this.todoSub.unsubscribe();
    this.backburnersSub.unsubscribe();
  }
  /**
   * @param task
   * Deletes an item from an array based on the string in the array
   */
  deleteTodo(task: Todo): void {
    for (let i = 0; i < this.todos.length; i++) {
      if (this.todos[i].todo === task.todo) {
        this.todoService.deleteTodo(task, 'todo');
        if (this.live === false) {
          this.subscribeToObservables();
        }
      }
    }
  }
  /**
   * @param task
   * Deletes an item from an array based on the string in the array
   */
  deleteBackburner(task: Backburner): void {
    for (let i = 0; i < this.backburners.length; i++) {
      if (this.backburners[i].backburner === task.backburner) {
        this.todoService.deleteTodo(task, 'backburner');
        if (this.live === false) {
          this.subscribeToObservables();
        }
      }
    }
  }
  /**
   * @param event
   * Handle drag and drop events
   */
  drop(event: CdkDragDrop<any[], any[]>, type: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      let newData = [];
      let index: number = 0;
      if (type === 'todo') {
        event.container.data.forEach((entry) => {
          newData.push({
            id: entry.id,
            index: index,
            todo: entry.todo,
          });
          index += 1;
        });
        this.todoService.sort(newData, 'todos');
      } else {
        event.container.data.forEach((entry) => {
          newData.push({
            id: entry.id,
            index: index,
            backburner: entry.todo,
          });
          index += 1;
        });
        this.todoService.sort(newData, 'backburners');
      }
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
    if (this.live === true) {
      this.todoService.createTodo(this.todos, 'todos');
    } else {
      this.todoService.createTodo(this.todos, 'backburners');
      this.subscribeToObservables();
    }
  }
  /**
   * Add an element to the backburner list
   */
  backburnerAppend(): void {
    if (this.live === true) {
      this.todoService.createTodo(this.backburners, 'backburners');
    } else {
      this.todoService.createTodo(this.backburners, 'backburners');
      this.subscribeToObservables();
    }
  }
  /**
   * Updates a todo
   */
  async updateTodo(todoString: string, todo: Todo) {
    this.todoService.updateTodo(todoString, todo.id, 'todos');
  }
  /**
   * Updates a todo
   */
  async updateBackburner(backburnerString: any, backburner: Backburner) {
    this.todoService.updateBackburner(
      backburnerString,
      backburner.id,
      'backburners'
    );
  }

  /**
   * Sanity unsubscribes
   */
  ngOnDestroy() {
    this.todoSub.unsubscribe();
    this.backburnersSub.unsubscribe();
  }
}
