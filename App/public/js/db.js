

// ------- DB SETUP -------

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
db.collection('pets').onSnapshot((snapshot) => {
    //gets a snapshot of this collection whenever theres a change
    console.log(snapshot.docChanges());
    snapshot.docChanges().forEach(change => {
        console.log(change, change.doc.data(), change.doc.id);
        if (change.type === 'added') {
            db.collection('users').where('username', '==', sessionStorage.getItem("currentUser")).get().then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    user = doc.data();
                    user.id = doc.id;
                })
                if(user.id == change.doc.data().user){
                    //add data
                    displayPet(change.doc.data(), change.doc.id);
                }
            });
        }
        if (change.type === 'removed') {
            //remove data
            removePet(change.doc.id);
        }
    });
})

// ------- PET DATA -------

//add pet
const form = document.querySelector('form');

form.addEventListener('submit', evt => {
    evt.preventDefault(); //so the page doesnt automatically refresh
    console.log(form);

    var elems = document.querySelectorAll('select');
    console.log(elems[0].value);

    const pet = {
        name: form.name.value,
        age: form.age.value,
        breed: elems[0].value
    }

    db.collection('users').where('username', '==', sessionStorage.getItem("currentUser")).get().then((snapshot) => {
        snapshot.docs.forEach((doc) => {
            user = doc.data();
            console.log(doc.id);
            user.id = doc.id;
        })
    
        pet.user = user.id;
    
        console.log(pet);
        db.collection('pets').add(pet)
            .catch(err => { console.log(err) });
    
        form.name.value = "";
        form.age.value = "";
    });
});
//delete pet
const petContainer = document.querySelector('.pets');

petContainer.addEventListener('click', evt => {
    if (evt.target.tagName === 'I') {
        const id = evt.target.getAttribute('data-id');
        db.collection('pets').doc(id).delete();
    }
});

