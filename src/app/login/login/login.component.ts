import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  /**
   *
   * @param auth
   * Set up with the auth service
   */
  constructor(public auth: AuthService) {}

  ngOnInit() {}
}
