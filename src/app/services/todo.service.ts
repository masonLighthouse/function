import { Injectable } from '@angular/core';
import { Todo } from '../models/todo.model';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  constructor(private db: DbService) {}
  /**
   * ORDERING THE DOCUMENTS BY TIMESTAMP
   */
  timestamp(): firebase.firestore.FieldValue {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    return timestamp;
  }
  /**
   *
   * @param workspaceId
   * GET THE FAVORITE PAGES FOR THE CURRENT WORKSPACE, ORDERED BY TITLE
   *
   */
  getTodos(): Observable<Todo[]> {
    const path = `users/${firebase.auth().currentUser.uid}/todos`;
    const query = (ref) => ref.orderBy('index', 'asc');
    return this.db.collection$(path, query);
  }
  /**
   *
   * @returns - promise in the form that this will make a new document
   */
  createTodo(todos: Todo[]): Promise<void> {
    const path = `users/${firebase.auth().currentUser.uid}/todos`;
    const id = this.randomFirebaseId();
    let largestIndex = 0;
    todos.forEach((todo) => {
      if (todo.index > largestIndex) {
        largestIndex = todo.index;
      }
    });
    const data = {
      id: id,
      index: largestIndex + 1,
      todo: '',
      createdTime: this.timestamp(),
    };
    return this.db.updateAt(path, data, id);
  }
  /**
   *
   * @returns - promise in the form that this will make a new document
   */
  updateTodo(todoString: string, todoId: string): Promise<any> {
    const path = `users/${firebase.auth().currentUser.uid}/todos`;
    return this.db.updateAt(path, { todo: todoString }, todoId);
  }
  /**
   *
   * @param todo - A todo
   * @returns a promise that this item is going to be deleted
   */
  deleteTodo(todo: Todo): Promise<void> {
    const path = `users/${firebase.auth().currentUser.uid}/todos/${todo.id}`;
    return this.db.delete(path);
  }
  /**
   *
   * @param todos - the array of todos
   * @returns void
   */
  sortTodos(todos: Todo[]): void {
    const db = firebase.firestore();
    const batch = db.batch();
    const refs = todos.map((todo) =>
      db
        .collection(`users/${firebase.auth().currentUser.uid}/todos`)
        .doc(todo.id)
    );
    refs.forEach((ref, index) => batch.update(ref, { index: index }));
    batch.commit();
  }
  /**
   * RANDOMLY GENERATE FIREBASE ID
   */
  randomFirebaseId() {
    // TODO : COLLISION CHECK
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let autoId = '';
    for (let i = 0; i < 20; i++) {
      autoId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return autoId;
  }
}
