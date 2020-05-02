//ALL PET DATA HANDLING

$(document).ready(() => {
    // getPets();
})

// -------- SETUP ------------


// DISPLAY DATA
function displayPetCard(data, id, user) {

    //display card
    const html = `
        <div class="card-panel pet light-green lighten-1 row waves-effect" onclick="petClicked('${id}')" data-id="${id}">
            <img id="pet-pfp-${id}" src="../img/lizard.png" class="pet-pfp circle responsive-img">
            <div class="pet-details grey-text text-lighten-3 right-align">
                <div class="pet-title">${data.name}</div>
                <div class="pet-flavour-text">${data.breed} <br> ${data.age} | SEX | WEIGHT</div>
            </div>
        </div>
    `;

    $("#user-pets").append(html);

    //retrieve icon
    download("images/" + user.uid + "/" + id + "/pfp", url => {
        if (url.code == null) {
            $("#pet-pfp-"+id).attr("src", url);
        }
    })
}
// SEND TO PET PAGE
function petClicked(id) {
    window.location.href = ("./pet.html?" + id);
}
// DISPLAY PAGE
function displayPetPage(data){
    data = data.replace("-", " ");
    db.collection("pets").doc(data).get().then(snapshot => {
        for (var key in snapshot.data()) {
            $("#pet-data").append(`<p>${key}: ${snapshot.data()[key]}</p>`);
        }
        $("#pet-data").append(`
        <a class="btn" onclick="deletePet('${snapshot.id}')">
            <i class="material-icons">delete</i>
        </a>
        <a class="btn" onclick="editPet('${snapshot.id}')">
            <i class="material-icons">edit</i>
        </a>`);
    })
}

// -------- EVENTS -----------

// --> READ

// GET DATA
function getPets() {
    $("#user-pets").empty();
    const user = JSON.parse(sessionStorage.user);
    db.collection("pets").where("user", "==", user.uid).get().then(snapshot => {
        snapshot.forEach(snap => {
            displayPetCard(snap.data(), snap.id, user);
        })
    })
}


// --> WRITE


// FORM OPEN
$("#open-form").click(() => {
    $("#new-pet-form").fadeIn();
})
// FORM CLOSE
$("#close-form").click(e => {
    e.preventDefault();
    $("#new-pet-form").fadeOut();
})
// FORM SEND
$("#send-form").click(e =>{
    e.preventDefault();
    addPet();
})

// ADD PET
function addPet(){

    //get form data
    var values = $("#add-pet input");
    if (values[2].value != "") {
        values.splice(2, 2);
    }
    var name = values[1].value;
    var pet = {
        name: values[1].value,
        dob: values[2].value,
        sex: values[3].value,
        breed: values[4].value,
        weight: values[5].value,
    }

    //validation
    var valid = true;
    for (var key in pet) {
        valid = (pet[key] == "" || pet[key] == "Choose One") ? false : true;
    }
    // valid = true;
    if (!valid) {
        $("#add-pet-err").html("Please fill out all data!");
    }
    else {
        const user = JSON.parse(sessionStorage.user);
        pet.user = user.uid;
        console.log(pet);

        db.collection('pets').add(pet).then(snapshot => {
            if (values[0].value != "") {
                var url = "images/" + user.uid + "/" + snapshot.id + "/pfp";
                upload($("#add-pet")[0].file.files[0], url, () => { });
            }
            getPets();
            $("#new-pet-form").fadeOut();
        }).catch(err => { console.log(err) });
    }
};
// PROFILE IMAGE UPLOAD
function pfpUpdate() {
    const user = JSON.parse(sessionStorage.getItem("user"));

    upload($("#add-pet")[0].file.files[0], 'temp/' + user.uid, () => {
        download('temp/' + user.uid, url => {
            $("#new-pet-pfp").attr("src", url);
            $("#new-pet-pfp").css("background-size", "cover");
        })
    })
}

// --> UPDATE

// OPEN EDIT FORM
function editPet(id){
    db.collection("pets").doc(id).get().then(snapshot => {
        // console.log(snapshot.data());
        var pet = Object.assign(snapshot.data());
        delete pet.user;
        // console.log(pet);
        // console.log($("#edit-pet input"));
        $("#edit-pet input").each(i => {
            console.log($($("#edit-pet input")[i]).val(pet.name));
        })
    })
}

// --> DELETE

// DELETE MODAL
function deletePet(id){
    db.collection("pets").doc(id).get().then(snapshot => {
        console.log(snapshot.data());
        $("#modal-title").html(`Are you sure you want to delete ${snapshot.data().name}?`)
        var modal = M.Modal.getInstance($("#delete-confirm"));
        modal.open();
    })
}
// DELETE CONFIRM
$("#confirm-delete").click(() => {
    
    db.collection('pets').doc(id).delete();
    window.location.href = "./main.html";
})