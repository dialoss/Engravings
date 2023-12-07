import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {collection, getFirestore, initializeFirestore, persistentMultipleTabManager, persistentLocalCache} from "firebase/firestore";
import {getStorage} from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getMessaging} from "firebase/messaging";

const configVariables = [
    'serviceAccountId', 'apiKey', 'projectId', 'authDomain', 'storageBucket', 'messagingSenderId', 'appId', 'databaseURL', 'messagingSenderId'
]

export const firebaseConfig = {};
for (const Var of configVariables) {
    firebaseConfig[Var] = process.env['REACT_APP_' + Var];
}

export const adminEmail = process.env.REACT_APP_ADMIN;

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const realtime = getDatabase(app);
export let messaging = null;

try {
    messaging = getMessaging(app);
    initializeFirestore(app,
        {localCache:
                persistentLocalCache({tabManager: persistentMultipleTabManager()})
        });
} catch (e){}


export const MDB = collection(firestore, 'apps', 'messenger', 'data');
export const CDB = collection(firestore, 'apps', 'comments', 'data');