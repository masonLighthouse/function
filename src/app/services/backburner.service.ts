import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Backburner } from '../models/backburner.model';

@Injectable({
  providedIn: 'root',
})
export class BackburnerService {
  constructor(private afs: AngularFirestore) {}
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
  getBackburners(): Observable<Backburner[]> {
    return this.afs
      .collection('users')
      .doc(`${firebase.auth().currentUser.uid}`)
      .collection<Backburner>('backburners', (ref) =>
        ref.orderBy('index', 'asc')
      )
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
  createBackburner(): Promise<void> {
    const id = this.randomFirebaseId();
    return this.afs
      .collection('users')
      .doc(`${firebase.auth().currentUser.uid}`)
      .collection<Backburner>('backburners')
      .doc(id)
      .set({
        id: id,
        index: 99,
        backburner: '',
        createdTime: this.timestamp(),
      });
  }
  /**
   *
   * @returns - promise in the form that this will make a new document
   */
  updateBackburner(
    backburnerString: string,
    backburnerId: string
  ): Promise<any> {
    return this.afs
      .collection('users')
      .doc(`${firebase.auth().currentUser.uid}`)
      .collection<Backburner>('backburners')
      .doc(backburnerId)
      .update({
        backburner: backburnerString,
      });
  }
  /**
   *
   * @param backburner - A backburner
   * @returns a promise that this item is going to be deleted
   */
  deleteBackburner(backburner: Backburner): Promise<void> {
    return this.afs
      .collection('users')
      .doc(`${firebase.auth().currentUser.uid}`)
      .collection<Backburner>('backburners')
      .doc(backburner.id)
      .delete();
  }
  /**
   *
   * @param backburners - the array of backburners
   * @returns void
   */
  sortBackburners(backburners: Backburner[]): void {
    const db = firebase.firestore();
    const batch = db.batch();
    const refs = backburners.map((backburner) =>
      db
        .collection(`users/${firebase.auth().currentUser.uid}/backburners`)
        .doc(backburner.id)
    );
    refs.forEach((ref, index) => batch.update(ref, { index: index }));
    batch.commit();
  }
  /**
   * RANDOMLY GENERATE FIREBASE ID
   */
  randomFirebaseId() {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let autoId = '';
    for (let i = 0; i < 20; i++) {
      autoId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return autoId;
  }
}
