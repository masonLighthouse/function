import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { ActivatedRoute, Router } from "@angular/router";
import { LoadingController, Platform } from "@ionic/angular";
import { Observable } from "rxjs";
import { User } from "../models/user.model";
import { DbService } from "./db.service";

@Injectable({
  providedIn: "root",
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
    private loadingController: LoadingController
  ) {}
}
