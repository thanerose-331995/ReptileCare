//offline data
db.enablePersistence()
    .catch(err => {
        if(err.code == 'failed-precondition'){
            console.log('persistence failed, are there multiple tabs open?');
        }
        else if(err.code == 'unimplemented'){
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
            //add data
            displayPet(change.doc.data(), change.doc.id);
        }
        if (change.type === 'removed') {
            //remove data
            removePet(change.doc.id);
        }
    });
})

//add pet
const form = document.querySelector('form');

form.addEventListener('submit', evt => {
    evt.preventDefault(); //so the page doesnt automatically refresh

    const pet = {
        name : form.name.value,
        age: form.age.value,
        breed: form.breed.value
    }

    db.collection('pets').add(pet)
        .catch(err => {console.log(err)});

    form.name.value = "";
    form.age.value = "";
    form.breed.value = "";
})

//delete pet
const petContainer = document.querySelector('.pets');
petContainer.addEventListener('click', evt => {
    if(evt.target.tagName === 'I'){
        const id = evt.target.getAttribute('data-id');
        db.collection('pets').doc(id).delete();
    }
})