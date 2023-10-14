import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { firebaseKey } from './api_keys';

const config = {
  apiKey: firebaseKey,
  authDomain: 'safarify-bbb42.firebaseapp.com',
  databaseURL: 'https://safarify-bbb42.firebaseio.com',
  projectId: 'safarify-bbb42',
  storageBucket: 'safarify-bbb42.appspot.com',
  messagingSenderId: '737237849450'
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();
const db = firebase.database();
const writeUserData = (formattedAdress, 
                      vernacularName, 
                      sciName, 
                      flickerUrl, 
                      viewportLngMin, 
                      viewportLngMax, 
                      viewportLatMin, 
                      viewportLatMax, 
                      speciesKeyForSaved, 
                      lat, lng, uid, cCode, photoOwner, licenseOwner) => { 
    return new Promise((resolve) => {                 
      db.ref(`users/${uid}/saved_cards`).push({
          place: formattedAdress,
          vernacular_name: vernacularName,
          sci_name: sciName,
          flicker_url: flickerUrl,
          species_key: speciesKeyForSaved,
          viewport_lng_min: viewportLngMin,
          viewport_lng_max: viewportLngMax,
          viewport_lat_min: viewportLatMin,
          viewport_lat_max: viewportLatMax,
          lat_place: lat,
          lng_place: lng,
          country_code: cCode,
          photo_owner: photoOwner,
          license_owner: licenseOwner
      }, resolve('SUCCESS'));
    }) 
};


export {
  auth,
  db,
  writeUserData
};
