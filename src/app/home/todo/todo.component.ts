import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Todo } from 'src/app/models/todo.model';
import { ContentService } from 'src/app/services/content.service';
import { Backburner } from 'src/app/models/backburner.model';
import { debounce } from 'debounce';

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
  constructor(private contentService: ContentService) {}
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
    this.todoSub = this.contentService
      .getContent('todos')
      .subscribe((todos) => {
        this.todos = todos;
      });
    this.backburnersSub = this.contentService
      .getContent('backburners')
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
        this.contentService.deleteContent(task, 'todos');
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
        this.contentService.deleteContent(task, 'backburners');
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
        this.contentService.sort(newData, 'todos');
      } else {
        event.container.data.forEach((entry) => {
          newData.push({
            id: entry.id,
            index: index,
            backburner: entry.todo,
          });
          index += 1;
        });
        this.contentService.sort(newData, 'backburners');
      }
    } else {
      console.log('This is when we transfer inside of the other arrays');
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
      this.contentService.createContent(this.todos, 'todos');
    } else {
      this.subscribeToObservables();
      setTimeout(() => {
        this.contentService.createContent(this.todos, 'todos');
      }, 100);
    }
  }
  /**
   * Add an element to the backburner list
   */
  backburnerAppend(): void {
    if (this.live === true) {
      this.contentService.createContent(this.backburners, 'backburners');
    } else {
      this.subscribeToObservables();
      setTimeout(() => {
        this.contentService.createContent(this.backburners, 'backburners');
      }, 100);
    }
  }
  /**
   * Updates a todo
   */
  async updateTodo(todoString: string, todo: Todo) {
    debounce(
      await this.contentService.updateTodo(todoString, todo.id, 'todos'),
      1000
    );
  }
  /**
   * Updates a todo
   */
  async updateBackburner(backburnerString: any, backburner: Backburner) {
    debounce(
      await this.contentService.updateBackburner(
        backburnerString,
        backburner.id,
        'backburners'
      ),
      1000
    );
  }
  /**
   *
   * @param todo - the todo in the array
   */
  onTodoCheck(clickedTodo: Todo) {
    // change it based on the ID
    this.todos.forEach((todo, index) => {
      if (todo.id === clickedTodo.id) {
        this.todos[index].done === true
          ? (this.todos[index].done = false)
          : (this.todos[index].done = true);
        this.contentService.updateTodoStrikethrough(
          this.todos[index].done,
          this.todos[index].id,
          'todo',
          'todos'
        );
      }
    });
  }
  /**
   *
   * @param clickedBackburner - the todo in the array
   */
  onBackburnerCheck(clickedBackburner: Backburner) {
    // change it based on the ID
    this.backburners.forEach((backburner, index) => {
      if (backburner.id === clickedBackburner.id) {
        this.backburners[index].done === true
          ? (this.backburners[index].done = false)
          : (this.backburners[index].done = true);
        this.contentService.updateBackburnerStrikethrough(
          this.backburners[index].done,
          this.backburners[index].id,
          'backburner',
          'backburners'
        );
      }
    });
  }

  /**
   * Sanity unsubscribes
   */
  ngOnDestroy() {
    this.todoSub.unsubscribe();
    this.backburnersSub.unsubscribe();
  }
}
