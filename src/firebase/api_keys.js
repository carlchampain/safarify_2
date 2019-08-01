import runtimeEnv from '@mars/heroku-js-runtime-env';

const env = runtimeEnv();

const flickerKey = env.REACT_APP_FLICKER;
const firebaseKey = env.REACT_APP_FIREBASE;
const googleMapKey = env.REACT_APP_GOOGLE_MAP;
const redListKey = env.REACT_APP_REDLIST; 

export { flickerKey, firebaseKey, googleMapKey, redListKey };
