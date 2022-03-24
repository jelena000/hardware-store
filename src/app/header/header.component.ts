import { Component, OnInit } from '@angular/core';
import { AngularFireAuth  } from '@angular/fire/auth';
import { Router } from '@angular/router';
import constants from '../../constants/constants.js'

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
    isLoggedIn = false;

    constructor(
        private router: Router,
        private auth: AngularFireAuth 
    ) {}

    ngOnInit(): void {
        //Check login state
        this.checkUser();
    }

    async checkUser(){
        // Get user id of currently signin user from local storage
        const local_data = localStorage.getItem(constants.USER_DATA);
        //Check does user exists in local storage
        if(local_data){
            //User found
            this.isLoggedIn = true;
        }
        else {
            //User not found, navigate to Login page
            this.isLoggedIn = false;
            this.router.navigate(['/login']);
        }
    }

    //Logout user, remove it from local storage and sign out from Firebase
    async onLogout(){
        try {
            //Remove user id from local storage
            localStorage.removeItem(constants.USER_DATA);
            this.isLoggedIn = false;

            //Sign out from firebase
            await this.auth.signOut();

            this.router.navigate(['/login']);
        } catch (error) {
            //Something went wrong
            console.log({onLogoutError: error});
        }
    }

    onLogin(){
        //Go to login page
        this.router.navigate(['/login']);
    }
}
