import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth  } from '@angular/fire/auth';
import { AngularFirestore  } from '@angular/fire/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
//Pozdrav, name, surname, adress, postal code, location, phone, email, password, confirmPassword
export class RegisterComponent implements OnInit {
    form: FormGroup;
    loading = false;
    returnUrl: string;
    errorMsg: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private auth: AngularFireAuth,
        private firestore: AngularFirestore,
    ) {}

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            hello: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required],
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            adress: ['', Validators.required],
            location: ['', Validators.required],
            postal: ['', Validators.required],
            phone: ['', Validators.required],
            confirmPassword: ['', Validators.required],
        });
        
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    register(){
        try {
            const { email, password, confirmPassword, firstname, lastname, adress, location, postal, phone, hello } = this.form.controls;
            this.loading = true;

            if(password.value !== confirmPassword.value){
                alert('wrong password');
                this.loading = false;
                return;
            }

            let data = {
                email : email.value, 
                password : password.value, 
                confirmPassword : confirmPassword.value, 
                firstname : firstname.value, 
                lastname : lastname.value, 
                adress : adress.value, 
                location : location.value, 
                postal : postal.value, 
                phone : phone.value, 
                hello : hello.value
            }

            this.auth.createUserWithEmailAndPassword(data.email, data.password)
            .then(data=>{
                console.log('user signup success ',data);

                this.firestore.collection('users').doc(data.user.uid).set(data)
                .then(() => {
                    this.loading = false;
                    this.router.navigate(['/']);
                })
                .catch((err) => {
                    this.loading = false;
                    console.log({err});

                    alert('sometinh wrong')
                })
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
            const { email } = this.form.controls;
            this.loading = true;

            this.auth.sendPasswordResetEmail(email.value)
            .then((data) => {
                this.loading = false;
                //console.log({data});
                
            }).catch((err) => {
                this.loading = false;
                //console.log({err});
            })
        } catch (error) {
            console.log({error});
            this.loading = false;
        }
    }

    onSubmit() {
        this.register()        
    }
}
