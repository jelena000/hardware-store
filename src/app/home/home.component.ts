import { Component, OnInit } from '@angular/core';
import { AngularFireAuth  } from '@angular/fire/auth';
import { Router } from '@angular/router';
import constants from '../../constants/constants.js'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    constructor(
        private router: Router,
    ) {}

    ngOnInit(): void {
        //check user
        this.checkUser();
    }

    //Check does user exists in local storage and if not navigate to login page
    async checkUser(){
        // Get user id of currently signin user from local storage
        const local_data = localStorage.getItem(constants.USER_DATA);

        if(!local_data){
            //user doesn't exist, navigate to login page
            this.router.navigate(['/login']);
        }
    }
}
