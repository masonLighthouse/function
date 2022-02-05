import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  constructor(private afs: AngularFirestore) {}
  /**
   *
   * @param path
   * @param query
   */
  collection$(
    path: string,
    query?: QueryFn<firebase.firestore.DocumentData>
  ): Observable<any[]> {
    return this.afs
      .collection(path, query)
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data: any = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  doc$(path: string): Observable<any> {
    return this.afs
      .doc(path)
      .snapshotChanges()
      .pipe(
        map((doc) => {
          return { id: doc.payload.id, data: doc.payload.data() };
        })
      );
  }

  /**
   * @param  {string} path 'collection' or 'collection/docID'
   * @param  {object} data new data
   *
   * Creates or updates data on a collection or document. Done so that it uses the ID that is made automatically.
   */
  updateAt(path: string, data: object, id?: string): Promise<any> {
    const segments = path.split('/').filter((v) => v);
    if (segments.length % 2) {
      // Odd is always a collection
      id
        ? this.afs.collection(path).doc(id).set(data, { merge: true })
        : this.afs.collection(path).add(data);
      return;
    } else {
      // Even is always document
      return this.afs.doc(path).set(data, { merge: true });
    }
  }

  /**
   * DELETE DOCUMENT FROM FIRESTORE
   * @param  {string} path path to document
   */
  delete(path: string): Promise<void> {
    return this.afs.doc(path).delete();
  }
}
