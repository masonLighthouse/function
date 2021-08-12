import { Injectable } from '@angular/core';
import { Todo } from '../models/todo.model';
import firebase from 'firebase/app';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  constructor(private afs: AngularFirestore) {}
  /**
   *
   * @param workspaceId
   * GET THE FAVORITE PAGES FOR THE CURRENT WORKSPACE, ORDERED BY TITLE
   *
   */
  getTodos(): Observable<Todo[]> {
    return this.afs
      .collection('users')
      .doc(`${firebase.auth().currentUser.uid}`)
      .collection<Todo>('todos', (ref) => ref.orderBy('index', 'asc'))
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { ...data, id };
          });
        })
      );
  }
  /**
   *
   * @returns - promise in the form that this will make a new document
   */
  createTodo(): Promise<DocumentReference<Todo>> {
    const id = this.randomFirebaseId();
    return this.afs
      .collection('users')
      .doc(`${firebase.auth().currentUser.uid}`)
      .collection<Todo>('todos')
      .add({
        id: id,
        index: 99,
        todo: '',
      });
  }
  /**
   *
   * @returns - promise in the form that this will make a new document
   */
  updateTodo(todoString: string, todoId: string): Promise<any> {
    return this.afs
      .collection('users')
      .doc(`${firebase.auth().currentUser.uid}`)
      .collection<Todo>('todos')
      .doc(todoId)
      .update({
        todo: todoString,
      });
  }
  /**
   *
   * @param todo - A todo
   * @returns a promise that this item is going to be deleted
   */
  deleteTodo(todo: Todo): Promise<void> {
    return this.afs
      .collection('users')
      .doc(`${firebase.auth().currentUser.uid}`)
      .collection<Todo>('todos')
      .doc(todo.id)
      .delete();
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
