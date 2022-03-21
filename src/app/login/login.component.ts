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
    errorMsg: string;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private auth: AngularFireAuth 
    ) {}

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    onSubmit() {
        try {
            const { email, password } = this.form.controls;
            this.loading = true;
            
            this.auth.signInWithEmailAndPassword(email.value, password.value)
            .then( data => {
                this.loading = false;
                const { user } = data;
                let userId = data.user.uid;

                this.router.navigate(['/']);
            }).catch((error) => {
                this.loading = false;

                var errorMessage = error.message;
                console.log({errorMessage});
            });
        } catch (error) {
            console.log({error});
            this.loading = false;
        }
    }
}
