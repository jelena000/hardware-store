import { Component, OnInit } from '@angular/core';
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
