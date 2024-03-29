import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { DbService } from './db.service';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Todo } from '../models/todo.model';
import { ContentService } from './content.service';
import { Backburner } from '../models/backburner.model';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // user object observable
  user$: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private db: DbService,
    private router: Router,
    private route: ActivatedRoute,
    private platform: Platform,
    private contentService: ContentService
  ) {
    this.user$ = this.afAuth.authState;
    /**
     * HANDLE THE ROOT SUBSCRIPTION TO THE USER IN THE ROOT OF THE APPLICATION
     */
    this.user$.subscribe((user) => {
      // if the user is present upon return
      if (user) {
        this.save(user);
        const returnUrl = localStorage.getItem('returnUrl');
        if (localStorage.getItem('returnUrl')) {
          this.router.navigateByUrl(returnUrl);
        }
        localStorage.removeItem('returnUrl');
      }
    });
  }
  /**
   * ORDERING THE DOCUMENTS BY TIMESTAMP
   */
  timestamp(): firebase.firestore.FieldValue {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    return timestamp;
  }
  /*
   * GOOGLE SIGN IN
   */
  async googleSignIn() {
    const returnUrl =
      this.route.snapshot.queryParamMap.get('returnUrl') || 'home';
    localStorage.setItem('returnUrl', returnUrl);
    // if we are on a native device
    if (this.platform.is('cordova')) {
      // this.nativeGoogleLogin();
    } else {
      try {
        // will check to see if we are on a native app later
        let user;
        // redirect the user to google auth provider
        user = await this.afAuth.signInWithRedirect(
          new firebase.auth.GoogleAuthProvider()
        );
        // return await this.updateUserData(user);
      } catch (err) {
        console.log(err);
      }
    }
  }
  /**
   *  SIGN THE CURRENT USER OUT, AND NAVIGATE BACK TO THE LOGIN PAGE!
   *  FOR NOW, DISMISSES THE POPOVER CONTROLLER IF IT IS CALLED ON
   */
  async signOut() {
    // this.popoverController.dismiss();
    await this.afAuth.signOut();
    return this.router.navigate(['/login']);
  }
  /**
   * SAVE THE USER
   */
  save(user: User) {
    const userPath = `users/${user.uid}`;
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
    this.db.updateAt(userPath, userData);
    // first see if it exists
    this.afs
      .collection('users')
      .doc(`${firebase.auth().currentUser.uid}`)
      .collection('mit')
      .get()
      .toPromise()
      .then((collection) => {
        if (collection.empty) {
          const mitPath = `users/${firebase.auth().currentUser.uid}/mit`;
          const mitData = {
            mitString: '',
          };
          this.db.updateAt(mitPath, mitData);
        }
      });
    // now to set up the other two
    this.afs
      .collection('users')
      .doc(`${firebase.auth().currentUser.uid}`)
      .collection('todos')
      .get()
      .toPromise()
      .then((collection) => {
        if (collection.empty) {
          const todoPath = `users/${firebase.auth().currentUser.uid}/todos`;
          const todoData: Todo = {
            id: this.contentService.randomFirebaseId(),
            todo: 'put todos here!',
            index: 99,
            createdTime: this.timestamp(),
            done: false,
          };
          this.db.updateAt(todoPath, todoData);
        }
      });
    // now to set up the other two
    this.afs
      .collection('users')
      .doc(`${firebase.auth().currentUser.uid}`)
      .collection('backburners')
      .get()
      .toPromise()
      .then((collection) => {
        if (collection.empty) {
          const backburnerPath = `users/${
            firebase.auth().currentUser.uid
          }/backburners`;
          const backburnerData: Backburner = {
            id: this.contentService.randomFirebaseId(),
            backburner: 'and, put backburners here',
            index: 99,
            createdTime: this.timestamp(),
            done: false,
          };
          this.db.updateAt(backburnerPath, backburnerData);
        }
      });
  }
  /**
   * RETURN THE USER'S UID
   */
  uid() {
    return this.user$
      .pipe(
        take(1),
        map((u) => u && u.uid)
      )
      .toPromise();
  }
}
