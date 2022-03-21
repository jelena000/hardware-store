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

            let form_data = {
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

            this.auth.createUserWithEmailAndPassword(form_data.email, form_data.password)
            .then(data=>{
                console.log('user signup success ',data);
                this.saveAdditionalUserData(data.user.uid, form_data);
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

    saveAdditionalUserData(userId, form_data){
        this.firestore.collection('users').doc(userId).set(form_data)
        .then((res) => {
            
            this.loading = false;
            this.router.navigate(['/register/insert-photo', userId]);
        })
        .catch((err) => {
            this.loading = false;
            alert('sometinh wrong')
        })
    }

    onSubmit() {
        this.register()        
    }
}
