import { Injectable } from '@angular/core';
import { Todo } from '../models/todo.model';
import firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
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
  getTodos() {
    return this.afs
      .collection('users')
      .doc(`${firebase.auth().currentUser.uid}`)
      .collection('todos')
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
   * @param todos - the array of todos
   * @returns void
   */
  sortTodos(todos: Todo[]): void {
    const db = firebase.firestore();
    const batch = db.batch();
    const refs: any[] = todos.map((todo) => {
      db.collection(`users/${firebase.auth().currentUser.uid}/todos`).doc(
        todo.id
      );
    });
    refs.forEach((ref, index) => batch.update(ref, { index: index }));
    batch.commit();
  }
}
