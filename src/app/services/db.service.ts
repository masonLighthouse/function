import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class DbService {
  constructor(private afs: AngularFirestore) {}
  /**
   * Dealing with collection observables
   * @param path
   * @param query
   */
  collection$(path: string, query: any) {
    return this.afs
      .collection(path, query)
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data: Object = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }
  /**
   * Dealing with document observables
   * @param path
   * @param query
   */
  doc$(path: string) {
    return this.afs
      .doc(path)
      .snapshotChanges()
      .pipe(
        map((doc) => {
          const data: Object = doc.payload.data();
          const id = doc.payload.id;
          return { id, ...data };
        })
      );
  }
  /**
   * Given a path to a collection or a document, deletes it
   * @param path
   * @returns
   */
  delete(path: string) {
    return this.afs.doc(path).delete();
  }
  /**
   * Given a path and a query, updates data at a collection or document
   * @param path
   * @param data
   */
  updateAt(path: string, data: Object): Promise<any> {
    const segments = path.split("/").filter((v) => {
      v;
    });
    if (segments.length % 2) {
      // we are dealing with a collection (odd)
      return this.afs.collection(path).add(data);
    } else {
      // we are dealing with a document (even)
      return this.afs.doc(path).update(data);
    }
  }
}
