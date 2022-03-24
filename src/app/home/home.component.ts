import { Component, OnInit } from '@angular/core';
import { AngularFireAuth  } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    constructor(
        private auth: AngularFireAuth 
    ) {}

    ngOnInit(): void {
        //load user for testing
        this.loadUser();
    }

    async loadUser(){
        let currentUser = await this.auth.currentUser;
        console.log(currentUser);
    }
}
