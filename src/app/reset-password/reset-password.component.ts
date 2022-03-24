import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth  } from '@angular/fire/auth';
import { AngularFirestore  } from '@angular/fire/firestore';
import constants from '../../constants/constants';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
    //Form group for all reseting password(password and confirmPassword) 
    form1: FormGroup;
    //Form group for sending email link(email) 
    form2: FormGroup;
    //Loading state for loading spinner
    loading = false;
    //With this value we conditionalyy show view on screen( Reset Password view or Send Email view)
    isCode = false;
    //Message value that will be displayed if something goes wrong ( In Send Email view)
    emailMsg: string;
    //Message value that will be displayed if something goes wrong  ( In Reset Password view)
    errorMsg: string;
    //Email from confirmation link
    email: string;
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private auth: AngularFireAuth,
        private firestore: AngularFirestore,
    ) {}

    ngOnInit(): void {
        //Create form with fields for Reset Password view
        this.form1 = this.formBuilder.group({
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
        });

        //Create form with fields for Send Email view
        this.form2 = this.formBuilder.group({
            email: ['', Validators.required],
        });
        
        //Check if there is valid code from email link
        this.verifyResetCode();
    }

    //Check if there is valid email link in url for reseting password
    verifyResetCode(){
        //Get params from current url
        const params = this.route.snapshot.queryParams;

        if(params?.oobCode){

            //Set loading 
            this.loading = true;

            //Firebase Auth checking if link is valid
            this.auth.verifyPasswordResetCode(params?.oobCode)
            .then((data) => {
                this.loading = false;

                //Link is valid so we can change view in (Reset Password view) and set given email adress
                this.isCode = true;
                this.email = data;
            }).catch((err) => {
                this.loading = false;

                //Link is not valid so we navigate to login page
                this.router.navigate(['/login']);
            })
        }
    }

    onResetPassword(){
        try {
            //Destruct fields
            const { password, confirmPassword } = this.form1.controls;
            const params = this.route.snapshot.queryParams;

            //Set loading
            this.loading = true;

            //Check if confirmPassword and password fields are same
            if(password.value !== confirmPassword.value){
                //Set messagge value and stop registration process
                this.errorMsg = constants.ERROR_CONFIRM_PASSWORD;
                this.loading = false;
                return;
            }

            //Firebase Auth set new password for current user
            this.auth.confirmPasswordReset(params?.oobCode, password.value)
            .then((data) => {
                //New password is set so we can navigate back to login page
                this.loading = false;
                this.router.navigate(['/login']);
            }).catch((err) => {
                //Something went wrong
                this.loading = false;
                this.errorMsg = constants.ERROR;
            })
        } catch (error) {
            //Something went wrong
            this.loading = false;
            this.errorMsg = constants.ERROR;
        }
    }

    //Send resetPassword link to desire email adress
    onSendEmail(){
        try {
            //Destruct fields
            const { email } = this.form2.controls;

            //Set loading
            this.loading = true;
            
            //Firebase Auth sends resetPassword link to desired email
            this.auth.sendPasswordResetEmail(email.value)
            .then((data) => {
                //Email is sent
                this.loading = false;
                //Notify user to check email inbox
                this.emailMsg = constants.CHECK_EMAIL;

                //Clear email field
                this.form2.reset();
            }).catch((err) => {
                //Something went wrong
                this.loading = false;
                this.errorMsg = constants.ERROR;
            })
        } catch (error) {
            //Something went wrong
            this.loading = false;
            this.errorMsg = constants.ERROR;
        }
    }
}
