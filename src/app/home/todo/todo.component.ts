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
import { BackburnerService } from 'src/app/services/backburner.service';

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
  constructor(
    private todoService: TodoService,
    private backburnerService: BackburnerService
  ) {}
  /**
   *
   */
  ngOnInit(): void {
    this.live = true;
    this.todoSub = this.todoService.getTodos().subscribe((todos) => {
      this.todos = todos;
    });
    this.backburnersSub = this.backburnerService
      .getBackburners()
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
        this.todoService.deleteTodo(task);
        if (this.live === false) {
          this.ngOnInit();
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
        this.backburnerService.deleteBackburner(task);
        if (this.live === false) {
          this.ngOnInit();
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
        this.todoService.sortTodos(newData);
      } else {
        event.container.data.forEach((entry) => {
          newData.push({
            id: entry.id,
            index: index,
            backburner: entry.todo,
          });
          index += 1;
        });
        this.backburnerService.sortBackburners(newData);
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
      this.todoService.createTodo();
    } else {
      this.todoService.createTodo();
      this.ngOnInit();
    }
  }
  /**
   * Add an element to the backburner list
   */
  backburnerAppend(): void {
    if (this.live === true) {
      this.backburnerService.createBackburner();
    } else {
      this.backburnerService.createBackburner();
      this.ngOnInit();
    }
  }
  /**
   * Updates a todo
   */
  async updateTodo(todoString: string, todo: Todo) {
    this.todoService.updateTodo(todoString, todo.id);
  }
  /**
   * Updates a todo
   */
  async updateBackburner(backburnerString: any, backburner: Backburner) {
    this.backburnerService.updateBackburner(backburnerString, backburner.id);
  }
  /**
   * Sanity unsubscribes
   */
  ngOnDestroy() {
    this.todoSub.unsubscribe();
    this.backburnersSub.unsubscribe();
  }
}
