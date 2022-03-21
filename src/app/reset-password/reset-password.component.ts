import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth  } from '@angular/fire/auth';
import { AngularFirestore  } from '@angular/fire/firestore';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
    form1: FormGroup;
    form2: FormGroup;
    loading = false;
    isCode = false;
    errorMsg: string;
    email: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private auth: AngularFireAuth,
        private firestore: AngularFirestore,
    ) {}

    ngOnInit(): void {
        this.form1 = this.formBuilder.group({
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
        });

        this.form2 = this.formBuilder.group({
            email: ['', Validators.required],
        });
        
        this.verifyResetCode();
    }

    verifyResetCode(){
        const params = this.route.snapshot.queryParams;

        if(params?.oobCode){
            this.loading = true;

            this.auth.verifyPasswordResetCode(params?.oobCode)
            .then((data) => {
                this.isCode = true;
                this.email = data;
                this.loading = false;
            }).catch((err) => {
                this.loading = false;
                this.router.navigate(['/login']);
            })
        }
    }

    onResetPassword(){
        try {
            const { password, confirmPassword } = this.form1.controls;
            const params = this.route.snapshot.queryParams;
            this.loading = true;

            if(password.value !== confirmPassword.value){
                alert('Password confirmation is wrong');
                this.loading = false;
                return;
            }

            this.auth.confirmPasswordReset(params?.oobCode, password.value)
            .then((data) => {
                console.log({data});
                this.loading = false;
                this.router.navigate(['/login']);
            }).catch((err) => {
                this.loading = false;
                console.log({err});
            })
        } catch (error) {
            console.log({error});
            this.loading = false;
        }
    }

    onSendEmail(){
        console.log('seeeeeeeeeeeeeeeeeend');
        
        try {
            const { email } = this.form2.controls;
            this.loading = true;
            
            console.log('send', { email: email.value});
            
            this.auth.sendPasswordResetEmail(email.value)
            .then((data) => {
                console.log({data});
                
                this.loading = false;
                this.form2.reset();
            }).catch((err) => {
                this.loading = false;
                console.log({err});
                
            })
        } catch (error) {
            console.log({error});
            this.loading = false;
        }
    }
}
