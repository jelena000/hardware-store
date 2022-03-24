import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth  } from '@angular/fire/auth';
import { AngularFirestore  } from '@angular/fire/firestore';
import constants from '../../constants/constants';

//User type
type User = {
    email : string,
    password : string,
    confirmPassword : string,
    firstname : string,
    lastname : string,
    adress : string,
    location : string,
    postal : string,
    phone : string,
    hello : string
};
@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
    //Formgroup for all fields 
    form: FormGroup;
    //Loading state for loading spinner
    loading = false;
    //Message value that will be displayed if something goes wrong
    errorMsg: string;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private auth: AngularFireAuth,
        private firestore: AngularFirestore,
    ) {}

    ngOnInit(): void {
        //Create form with fields
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
    }

    //Registration
    onSubmit(){
        try {
            //Destructuring form fields
            const { email, password, confirmPassword, firstname, lastname, adress, location, postal, phone, hello } = this.form.controls;

            //Change loading state and clear error message
            this.loading = true;
            this.errorMsg = '';

            //Check if from fields are valid
            if (this.form.invalid) {
                //Set messagge value and stop registration process 
                this.errorMsg = constants.ERROR_FORM;
                this.loading = false;
                return;
            }

            //Check if confirmPassword and password fields are same
            if(password.value !== confirmPassword.value){
                //Set messagge value and stop registration process 
                this.errorMsg = constants.ERROR_CONFIRM_PASSWORD;
                this.loading = false;
                return;
            }

            //Create user object with values from form
            let form_data:User = {
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
            };

            //Firebase Auth - creates user with email and password
            this.auth.createUserWithEmailAndPassword(form_data.email, form_data.password)
            .then((data) => {
                //After successfull registration, send to Firebase additional data for created user
                this.saveAdditionalUserData(data.user.uid, form_data);
            })
            .catch((error) => {
                //Something went worng with Firebase service
                this.loading = false;

                //Check what went wrong and set message
                const errorCode = error.code;
                if(errorCode === 'auth/email-already-in-use'){
                    //Email already in use
                    this.errorMsg = constants.ERROR_EMAIL_USED;
                }
                else if(errorCode === 'auth/weak-password'){
                    //Weak password
                    this.errorMsg = constants.ERROR_WEAK_PASSWORD;
                }
                else {
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

    saveAdditionalUserData(userId:string, form_data:User){
        //Firebase creates new document with all user data in collection "users"
        this.firestore.collection('users').doc(userId).set(form_data)
        .then((res) => {
            //After successfull upload, navigate to Page for uploading User Image
            this.loading = false;
            this.router.navigate(['/register/insert-photo', userId]);
        })
        .catch((err) => {
            //Something went wrong
            this.loading = false;
            this.errorMsg = constants.ERROR;
        })
    }
}
