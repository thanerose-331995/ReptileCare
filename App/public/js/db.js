

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

//realtime listener
function getSnapshot() {
    db.collection('pets').onSnapshot((snapshot) => {
        //gets a snapshot of this collection whenever theres a change
        console.log(snapshot.docChanges());
        snapshot.docChanges().forEach(change => {
            if (change.type === 'added' || change.type === 'modified') {
                var user = JSON.parse(sessionStorage.getItem("user"));
                if (user.uid == change.doc.data().user) {
                    //add data
                    displayPet(change.doc.data(), change.doc.id);
                }
            }
            if (change.type === 'removed') {
                //remove data
                removePet(change.doc.id);
            }
        });
    })
}

// ------- PET DATA -------

//add pet
$("#add-pet").on("submit", e => {
    e.preventDefault();
    var form = $("#add-pet")[0];
    var elems = $("#select-breed");
    const name = form.name.value.replace(form.name.value[0], form.name.value[0].toUpperCase());
    const pet = {
        name: name,
        age: form.age.value,
        breed: elems[0].value
    }
    var user = JSON.parse(sessionStorage.getItem("user"));
    pet.user = user.uid;

    db.collection('pets').add(pet)
        .catch(err => { console.log(err) });

    form.name.value = "";
    form.age.value = "";
})

//delete pet
function deletePet(id) {
    console.log("deleting: ", id);
    db.collection('pets').doc(id).delete();
    const modal = $("#pet-modal-" + id);
    M.Modal.getInstance(modal).close();
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

function update(collection, id, data){
    db.ref(collection + '/' + id).set(data);
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
