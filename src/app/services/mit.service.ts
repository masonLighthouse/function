import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class MitService {
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {}
  /**
   *
   * @param mitString
   * SAVE THE MIT STRING
   */
  async saveMit(mitString: string): Promise<any> {
    const user = await this.afAuth.currentUser;
    return this.afs.collection('users').doc(user.uid).collection('mit').add({
      mitString,
    });
  }
}
