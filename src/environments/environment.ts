// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const firebaseConfig = {
    apiKey: "AIzaSyBXgKJX1fvD8xzMiQUUhTcu5Uut_oivsmk",
    authDomain: "hardware-rental-7f359.firebaseapp.com",
    projectId: "hardware-rental-7f359",
    storageBucket: "hardware-rental-7f359.appspot.com",
    messagingSenderId: "87791185243",
    appId: "1:87791185243:web:5f5cc5477256bbc4037e7e",
    measurementId: "G-85B59NPED6"
};

export const environment = {
    production: false,
    firebase : firebaseConfig
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
