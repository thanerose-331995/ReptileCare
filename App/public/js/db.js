

// ------- DB SETUP -------


// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAx_54I7b7cpNMPO87eJzpV6-HkDgl8pMc",
    authDomain: "petapp-616ba.firebaseapp.com",
    databaseURL: "https://petapp-616ba.firebaseio.com",
    projectId: "petapp-616ba",
    storageBucket: "petapp-616ba.appspot.com",
    messagingSenderId: "535826044325",
    appId: "1:535826044325:web:c46b30b76358f49585c44c",
    measurementId: "G-NG8VX73KQ1"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const storageRef = storage.ref(); // a reference point for the storage

//offline data
db.enablePersistence()
    .catch(err => {
        if (err.code == 'failed-precondition') {
            console.log('persistence failed, are there multiple tabs open?');
        }
        else if (err.code == 'unimplemented') {
            console.log('persistence failed, not avalible in this browser.');
        }
    })


// ------- EVENTS ---------

function addEvent(event){
    db.collection('calendar').add(event);
}

// ------- FILE HANDING ---

//upload file
function upload(file, urlRef, callback) {
    storageRef.child(urlRef).put(file).then(function (snapshot) {
        callback(snapshot);
    })
}

//get file url to use in app
function download(urlRef, callback) {
    storageRef.child(urlRef).getDownloadURL().then(function (url) {
        callback(url)
    }).catch(err => { callback(err) })
}

// ------- GENERAL -------

//get any data
function getData(collection, data, callback) {
    db.collection(collection).doc(data).get().then(snapshot => {
        callback(snapshot.data());
    })
}

//format form to obj
function objectifyForm(formArray) {//serialize data function
    var returnArray = {};
    for (var i = 0; i < formArray.length; i++) {
        if (formArray[i]['value'] != "" && formArray[i]['name'] != "") {
            returnArray[formArray[i]['name']] = formArray[i]['value'];
        }
    }
    return returnArray;
}
