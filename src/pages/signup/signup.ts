import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  inputName;
  inputEmail;
  inputPassword;

  constructor(public navCtrl: NavController) {
  }

  signup() {
    alert("hey");
  }
  
}
