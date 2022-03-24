import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth  } from '@angular/fire/auth';
import constants from '../../constants/constants.js'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    //Formgroup for all fields 
    form: FormGroup;
    //Loading state for loading spinner
    loading = false;
    //Message value that will be displayed if something goes wrong
    errorMsg: string;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private auth: AngularFireAuth 
    ) {}

    ngOnInit(): void {
        //Create form with fields
        this.form = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    //Login
    onSubmit() {
        try {
            //Destructuring form fields
            const { email, password } = this.form.controls;

            //Change loading state and clear error message
            this.loading = true;
            this.errorMsg = '';

            //Check if from fields are valid
            if (this.form.invalid) {
                //Set messagge value and stop login process 
                this.errorMsg = constants.ERROR_FORM;
                this.loading = false;
                return;
            }

            //Firebase Auth - sign in user with email and password
            this.auth.signInWithEmailAndPassword(email.value, password.value)
            .then( data => {
                this.loading = false;

                //After successfull sign in, get user ID from result and save it in local storage 
                let userId = data.user.uid;
                localStorage.setItem(constants.USER_DATA, JSON.stringify({ userId: userId}));

                //Navigate to home page
                this.router.navigate(['/']);
            }).catch((error) => {
                //Something went worng with Firebase service
                this.loading = false;

                if(error.code === 'auth/user-not-found'){
                    //Wrong email adress
                    this.errorMsg = constants.ERROR_EMAIL;
                }
                else if(error.code === "auth/wrong-password"){
                    //Wrong Password
                    this.errorMsg = constants.ERROR_PASSWORD;
                }else {
                    //Something went wrong
                    this.errorMsg = constants.ERROR;
                }
            });
        } catch (error) {
            //Something went wrong
            this.loading = false;
            this.errorMsg = constants.ERROR;
        }
    }
}
