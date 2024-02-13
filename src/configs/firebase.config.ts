import { credential } from "firebase-admin";
import { initializeApp } from 'firebase-admin/app';

const connectFireBase = () => {
  initializeApp({
    credential: credential.cert(require('../../temp-alarm-firebase-adminsdk-8vqko-fe5609cb68.json')),
    projectId: 'temp-alarm',
  });
}

export default connectFireBase;