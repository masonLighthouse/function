import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
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
  getContent(type: string): Observable<any[]> {
    const path = `users/${firebase.auth().currentUser.uid}/${type}`;
    const query = (ref: { orderBy: (arg0: string, arg1: string) => any }) =>
      ref.orderBy('index', 'asc');
    return this.db.collection$(path, query);
  }
  /**
   *
   * @returns - promise in the form that this will make a new document
   */
  createContent(items: any[], type: string): Promise<void> {
    const path = `users/${firebase.auth().currentUser.uid}/${type}`;
    const id = this.randomFirebaseId();
    let largestIndex = 0;
    items.forEach((item) => {
      if (item.index > largestIndex) {
        largestIndex = item.index;
      }
    });
    const data = {
      id: id,
      index: largestIndex + 1,
      type: '',
      createdTime: this.timestamp(),
    };
    return this.db.updateAt(path, data, id);
  }
  /**
   *
   * @returns - promise in the form that this will make a new document
   */
  updateTodo(
    updateString: string,
    typeId: string,
    colType: string
  ): Promise<any> {
    const path = `users/${firebase.auth().currentUser.uid}/${colType}`;
    return this.db.updateAt(path, { todo: updateString }, typeId);
  }
  /**
   *
   * @returns - promise in the form that this will make a new document
   */
  updateBackburner(
    updateString: string,
    typeId: string,
    colType: string
  ): Promise<any> {
    const path = `users/${firebase.auth().currentUser.uid}/${colType}`;
    return this.db.updateAt(path, { backburner: updateString }, typeId);
  }
  /**
   *
   * @param todo - A todo
   * @returns a promise that this item is going to be deleted
   */
  deleteContent(task: any, type: string): Promise<void> {
    const path = `users/${firebase.auth().currentUser.uid}/${type}/${task.id}`;
    return this.db.delete(path);
  }
  /**
   *
   * @param items - the array of either the items or backburners
   * @returns void
   */
  sort(items: any[], type: string): void {
    const db = firebase.firestore();
    const batch = db.batch();
    const refs = items.map((item) =>
      db
        .collection(`users/${firebase.auth().currentUser.uid}/${type}`)
        .doc(item.id)
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
