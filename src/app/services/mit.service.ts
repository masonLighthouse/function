import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { DbService } from './db.service';
import { map, take } from 'rxjs/operators';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class MitService {
  constructor(private afs: AngularFirestore, private db: DbService) {}

  /**
   *
   * @param mitString
   * SAVE THE MIT STRING
   */
  saveMit(mitId: string, mitString: string): Promise<any> {
    return this.afs
      .collection('users')
      .doc(`${firebase.auth().currentUser.uid}`)
      .collection('mit')
      .doc(mitId)
      .update({
        mitString,
      });
  }
  /**
   *
   * @returns a promise of an observable of the MIT of the user (this stays the same)
   */
  getMit() {
    return this.afs
      .collection('users')
      .doc(`${firebase.auth().currentUser.uid}`)
      .collection('mit')
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }
}
