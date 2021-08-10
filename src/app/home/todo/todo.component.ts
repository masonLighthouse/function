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
  backburners: Todo[];
  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.todoSub = this.todoService.getTodos().subscribe((todos) => {
      this.todos = todos;
      this.backburners = todos;
    });
  }
  /**
   * @param event
   * Handle drag and drop events
   */
  drop(event: CdkDragDrop<Todo[], Todo[]>) {
    console.log('event: ', event);
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      console.log(event.previousIndex, 'New index: ', event.currentIndex);
      let newData: Todo[] = [];
      let index: number = 0;
      event.container.data.forEach((entry) => {
        console.log(entry);
        newData.push({
          id: entry.id,
          index: index,
          todo: entry.todo,
        });
        index += 1;
      });
      this.todoService.sortTodos(newData);
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
    this.todoService.createTodo();
  }
  /**
   * Updates a todo
   */
  updateTodo(ev: any) {
    console.log(ev);
    console.log('Anything?');
    // this.todoService.updateTodo();
  }
  /**
   * Add an element to the backburner list
   */
  backburnerAppend(): void {
    this.backburners.push({ id: 'HAHA', todo: '', index: 1 });
  }
  /**
   * @param task
   * Deletes an item from an array based on the string in the array
   */
  deleteItem(task: string): void {
    for (let i = 0; i < this.todos.length; i++) {
      if (this.todos[i].todo === task) {
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
