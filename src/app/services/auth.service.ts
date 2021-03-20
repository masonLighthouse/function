import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase/app';
import { LoadingController, Platform, PopoverController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { DbService } from './db.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // user object observable
  user$: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private db: DbService,
    private router: Router,
    private route: ActivatedRoute,
    private platform: Platform,
    private loadingController: LoadingController,
    private popoverController: PopoverController
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
    const path = `users/${user.uid}`;
    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
    this.db.updateAt(path, data);
  }
  /**
   * LOADER LOGIC
   */
  async presentLoader() {
    const loading = await this.loadingController.create({
      message: 'Logging you in',
    });
    await loading.present();
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
