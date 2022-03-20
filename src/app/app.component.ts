import { Component, OnInit } from '@angular/core';
import {firebaseConfig} from '../environments/environment.prod'
//import * as firebase from 'firebase/app'; //The core firebase client
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
    constructor(){
        try {
            console.log('init');
            
            //firebase.initializeApp(firebaseConfig);
            
        } catch (error) {
            console.log({ ferror: error});
            
        }
    }
}
