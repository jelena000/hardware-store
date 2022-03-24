import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import constants from '../../constants/constants';

@Component({
    selector: 'app-register-photo',
    templateUrl: './register-photo.component.html',
    styleUrls: ['./register-photo.component.css']
})
export class RegisterPhotoComponent implements OnInit {
    //Loading state for loading spinner
    loading = false;
    //Message value that will be displayed if something goes wrong
    errorMsg: string;
    //User id of currently signed in user
    userID: string;
    //Array for images
    files: File[];
    //True if image is selected
    selected = false;
    //Url of selected image (currently not in use)
    imageUrl: string;

    constructor(
        private router: Router,
        private auth: AngularFireAuth,
        private firestorage: AngularFireStorage,
        private firestore: AngularFirestore,
    ) {}

    ngOnInit(): void {
        //Get user id of currently signin user
        this.getSigninUserId()
    }

    async getSigninUserId(){
        // Get user id of currently signin user
        const currentUser = await this.auth.currentUser;
        if(currentUser?.uid){
            //Set user id 
            this.userID = currentUser.uid;
        }
        else {
            //Something went wrong, cannot find user... Go back to Registration page
            this.router.navigate(['/register']);
        }
    }

    async onSubmit() {
        try {
            this.loading = true;

            if(this.userID && this.files.length > 0){
                const file = this.files[0];

                // Create a reference of Firebase Storage adress
                let storageRef = this.firestorage.ref(this.userID + '/profilePicture/' + file.name);

                // Upload file to Firebase Storage
                storageRef.put(file).then((res) => {
                    //After successfull image upload, get accessable image url
                    this.getImageUrl(file.name);
                })
                .catch((err) => {
                    //Something went wrong
                    this.loading = false;
                    this.errorMsg = constants.ERROR;
                });
            }else {
                this.loading = false;
                this.errorMsg = constants.ERROR_CHOOSE_IMAGE;
            }
        } catch (error) {
            //Something went wrong
            this.loading = false;
            this.errorMsg = constants.ERROR;
        }
    }

    getImageUrl(imageName:string){
        try {
            //Create a reference of Firebase Storage adress
            let storageRef = this.firestorage.ref(this.userID + '/profilePicture/' + imageName);

            //Get exact url location for accessing image publicly
            storageRef.getDownloadURL().toPromise().then( (url) => {
                //After successfull downloading url of image, update user data with new imageUrl
                this.imageUrl = url;
                this.updateUserImageUrl(url);
            });
        } catch (error) {
            //Something went wrong
            this.loading = false;
            this.errorMsg = constants.ERROR;
        }
    }

    updateUserImageUrl(imageUrl:string){
        try {
            //Updates imageUrl field in "users" collection 
            this.firestore.collection('users').doc(this.userID).update({
                imageUrl: imageUrl
            })
            .then(() => {
                //Successfull update
                this.loading = false;
                this.router.navigate(['/']);
            })
            .catch((err) => {
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

    //Handles image file that was choosen
    onSelect(e: any){
        try {
            //get files from event
            const files = e.addedFiles;

            if(files.length > 0){
                //Add file to array and tell that image is selected
                this.files = files;
                this.selected = true;
            }
        } catch (error) {
            //Something went wrong
            this.errorMsg = constants.ERROR;
        }
    }

    //Remove file from array and tell that image is not selected
    onRemove(f){
        this.files = [];
        this.selected = false;
    }

    //Skip to home page
    onSkip(){
        this.router.navigate(['/']);
    }
}
