import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NavController, NavParams, Alert, AlertController } from 'ionic-angular';
import { CartPage } from '../cart/cart';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public feeders:any;
  feederForm: FormGroup;
  amount:number = 0;
  succesfulPayments:number = 0;
  description:string;

  constructor(public navCtrl: NavController,
              public http: HttpClient, 
              private payPal: PayPal,
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              private alertCtrl: AlertController) {
    this.getRemoteData();
    this.feederForm = this.formBuilder.group({
      amount: [''],
      feeder: ['']
    });
  }

  getRemoteData() {
    let url = 'http://127.0.0.1:8000/api/feeders/';
    //let url = 'https://jsonplaceholder.typicode.com/posts';
    let data:Observable<any>;
    data = this.http.get(url);
    data.subscribe(result => {
      this.feeders = result;
      console.log(JSON.stringify(result));
    });

  }

  goToCart(params){
    if (!params) params = {};
    //this.navCtrl.push(CartPage);
  }

  changeAmount(amount:number) {
    this.amount = amount;
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Pago exitoso',
      subTitle: 'Muchas gracias por tu pago <3',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  activateFeeder() {
    let url = 'http://192.168.0.22/toggle';
    this.http.get(url).subscribe();
  }

  paypalPayment() {
    this.description = "Donacion de $" + this.amount;
    this.payPal.init({
      PayPalEnvironmentProduction: 'YOUR_PRODUCTION_CLIENT_ID',
      PayPalEnvironmentSandbox: 'AWhQOHFuhMITy7UxxilzYPJXZwNl721HdL_idN-JH2ZNX_XS1kKxQzSRnImNAtDtpmRvBVtBAbj9_0Ng'
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        //let payment = new PayPalPayment('3.33', 'USD', 'Description', 'sale');
        let payment = new PayPalPayment(this.amount.toString(), 'USD', this.description, 'sale');
        this.payPal.renderSinglePaymentUI(payment).then(() => {
          // Successfully paid
    
          // Example sandbox response
          //
          // {
          //   "client": {
          //     "environment": "sandbox",
          //     "product_name": "PayPal iOS SDK",
          //     "paypal_sdk_version": "2.16.0",
          //     "platform": "iOS"
          //   },
          //   "response_type": "payment",
          //   "response": {
          //     "id": "PAY-1AB23456CD789012EF34GHIJ",
          //     "state": "approved",
          //     "create_time": "2016-10-03T13:33:33Z",
          //     "intent": "sale"
          //   }
          // }
          this.succesfulPayments++;
          this.presentAlert();
          this.activateFeeder();
        }, () => {
          // Error or render dialog closed without being successful
        });
      }, () => {
        // Error in configuration
      });
    }, () => {
      // Error in initialization, maybe PayPal isn't supported or something else
    });
  } 

}
