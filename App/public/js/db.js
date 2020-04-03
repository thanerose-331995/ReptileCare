

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
            if (change.type === 'added') {
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
const form = document.querySelector('form');

form.addEventListener('submit', evt => {
    evt.preventDefault(); //so the page doesnt automatically refresh

    var elems = document.querySelectorAll('select');

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
});
//delete pet
const petContainer = document.querySelector('.pets');

petContainer.addEventListener('click', evt => {
    if (evt.target.tagName === 'I') {
        const id = evt.target.getAttribute('data-id');
        db.collection('pets').doc(id).delete();
    }
});

//GET ANY DATA
function getData(collection, data, callback) {
    db.collection(collection).doc(data).get().then(snapshot => {
        callback(snapshot.data());
    })
}

//FORM FORMATTING
function objectifyForm(formArray) {//serialize data function
    var returnArray = {};
    for (var i = 0; i < formArray.length; i++) {
        returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    return returnArray;
}