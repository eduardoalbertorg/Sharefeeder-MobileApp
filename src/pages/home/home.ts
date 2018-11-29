import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CartPage } from '../cart/cart';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public feeders:any;

  constructor(public navCtrl: NavController, public http: HttpClient) {
    this.getRemoteData();
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
}
