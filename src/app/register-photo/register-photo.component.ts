import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth  } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
    selector: 'app-register-photo',
    templateUrl: './register-photo.component.html',
    styleUrls: ['./register-photo.component.css']
})
export class RegisterPhotoComponent implements OnInit {
    form: FormGroup;
    loading = false;
    errorMsg: string;
    userID: string;
    files: [];
    selected = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private auth: AngularFireAuth,
        private firestorage: AngularFireStorage,
    ) {}

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            confirmPassword: ['', Validators.required],
        });
        
        this.route.params.subscribe(params => {
            this.userID = params['id'];
        });
    }

    onSubmit(e) {
        console.log({ userid: this.userID});

        try {
            if(this.userID && this.files.length > 0){
                // Get current username
                var currentUser = this.auth.currentUser;
                console.log({currentUser});
                let file = this.files[0];
                // Create a Storage Ref w/ username
                var storageRef = this.firestorage.ref(this.userID + '/profilePicture/' + file.name);
                
                // Upload file
                var task = storageRef.put(file).then((data) =>{
                    console.log({data});
                    
                });

                var starsRef = storageRef.child(this.userID + '/profilePicture/' + file.name);

                starsRef.getDownloadURL().then(function(url) {
                    // Insert url into an <img> tag to "download"
                    console.log({url});
                });
                console.log({task});
            }else {
                alert('doens have data')
            }
        } catch (error) {
            console.log({error});
        }
    }

    onShowImage(){
        try {
            if(this.userID && this.files.length > 0){
                var storageRef = this.firestorage.ref(this.userID + '/profilePicture/ras8.png');

                var starsRef = storageRef.child(this.userID + '/profilePicture/ras8.png');

                starsRef.getDownloadURL().then(function(url) {
                    // Insert url into an <img> tag to "download"
                    console.log({url});
                });
            }else {
                alert('doens have data')
            }
        } catch (error) {
            console.log({error});
        }
    }

    onRemove(f){

    }
   
    onSelect(e: Event){
        try {
            let files = e.addedFiles;

            if(files.length > 0){
                this.files = files;
                this.selected = true;
            }
        } catch (error) {
            console.log({error});
            
        }
        
    }
}
