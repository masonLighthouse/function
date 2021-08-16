import { Injectable } from '@angular/core';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  constructor() {}
  /**
   * ORDERING THE DOCUMENTS BY TIMESTAMP
   */
  timestamp(): firebase.firestore.FieldValue {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    return timestamp;
  }
}
