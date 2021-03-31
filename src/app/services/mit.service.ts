import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Todo } from "../models/todo.model";
import { DbService } from "./db.service";

@Injectable({
  providedIn: "root",
})
export class MitService {
  constructor(private afAuth: AngularFireAuth, private db: DbService) {}
  /**
   * Create a todo in the database
   * @param data
   * @returns
   */
  async createTodo(data: Todo): Promise<void> {
    const user = await this.afAuth.currentUser;
    return this.db.updateAt(`users/${user.uid}/todos`, data);
  }
}
