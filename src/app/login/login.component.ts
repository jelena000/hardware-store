import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//import * as firebase from 'firebase/app';
import { AngularFireAuth  } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    errorMsg: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private auth: AngularFireAuth 
    ) {}

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    login(){
        try {
            const { email, password } = this.form.controls;
            this.loading = true;

            this.auth.signInWithEmailAndPassword(email.value, password.value)
            .then(data=>{
                this.loading = false;

                console.log('user dign in success ',email, data)
            })
            .catch((error) => {
                this.loading = false;
                console.log('firebase sign in error ',email, error)
            });
        } catch (error) {
            console.log({error});
            this.loading = false;
        }
    }

    register(){
        try {
            const { email, password } = this.form.controls;
            this.loading = true;

            this.auth.createUserWithEmailAndPassword(email.value, password.value)
            .then(data=>{
                this.loading = false;
                console.log('user signup success ',data);
            })
            .catch((error) => {
                this.loading = false;
                var errorCode = error.code;
                var errorMessage = error.message;

                if(errorCode === 'auth/email-already-in-use'){
                    this.errorMsg = errorMessage;
                }
            });
        } catch (error) {
            console.log({error});
            this.loading = false;
        }
    }

    forgotPassword(){
        try {
            const { email, password } = this.form.controls;
            this.loading = true;

            this.auth.sendPasswordResetEmail(email.value)
            .then((data) => {
                console.log({data});
                
            }).catch((err) => {
                console.log({err});
            })
        } catch (error) {
            console.log({error});
            this.loading = false;
        }
    }

    onSubmit() {
        try {
            const { email, password } = this.form.controls;
            this.loading = true;
            
            this.auth.signInWithEmailAndPassword(email.value,password.value)
            .then(data=>{
                this.loading = false;

                console.log('user dign in success ',email, data)
            }).catch((error) => {
                this.loading = false;

                console.log('firebase sign in error ',email, error)
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log({errorMessage});
            });
        } catch (error) {
            console.log({error});
            this.loading = false;
        }
        
    }

}
