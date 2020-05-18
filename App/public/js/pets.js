//ALL PET DATA HANDLING

$(document).ready(() => {
    console.log("pet.js loaded");
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
            <div class="pet-flavour-text">${data.breed} <br> ${data.dob} | ${data.sex} | ${data.weight}</div>
        </div>
    </div>
`;

    $("#user-pets").append(html);

    //retrieve icon
    download("images/" + user.uid + "/" + id + "/pfp", url => {
        if (url.code == null) {
            $("#pet-pfp-" + id).attr("src", url);
        }
    })
}
// SEND TO PET PAGE
function petClicked(id) {
    window.location.href = ("./pet.html?" + id);
}
// DISPLAY PAGE
function displayPetPage(data) {
    $("#pet-data").empty();
    data = data.replace("-", " ");
    db.collection("pets").doc(data).get().then(snapshot => {
        var pet = Object.assign(snapshot.data());
        $("#pet-data").append(`<img id="pet-pfp" src="../img/lizard.png" class="responsive-img circle" style="height: 100px;width: 100px;">`);
        delete pet.user;
        for (var key in pet) {
            //generatively adding p tag with data
            if(key == "name"){
                $("#name").html(pet[key]);
            }else{
                $("#pet-data").append(`
                    <div class="col s12 l12 white-text">
                        <div class="card light-green lighten-1">
                            <div class="card-content">
                                <p><b><h6>${key}</h6></b>${pet[key]}</p>
                            </div>
                        </div>
                </div>`);
            }
        }
        $("#pet-data").append(`
    <br>
    <a class="btn-floating red darken-4" onclick="deletePet('${snapshot.id}')">
        <i class="material-icons">delete</i>
    </a>
    <a class="btn-floating teal accent-4" onclick="editPet('${snapshot.id}')">
        <i class="material-icons">edit</i>
    </a>
    <br><br>`);
        $("#pet-data").attr("pet-id", snapshot.id);
        const user = JSON.parse(sessionStorage.user);
        download("images/" + user.uid + "/" + snapshot.id + "/pfp", url => {
            if (url.code == null) {
                $("#pet-pfp").attr("src", url);
                $("#edit-pet-pfp").attr("src", url);
            }
            $("#preload").fadeOut(() => {
                $("#pet-data").fadeIn();
            });
        })
    })
}

// -------- EVENTS -----------

// --> READ

// GET DATA
function getPets() {
    $("#user-pets").empty();
    const user = JSON.parse(sessionStorage.user);
    db.collection("pets").where("user", "==", user.uid).get().then(snapshot => {
        if (snapshot.size > 0) {
            snapshot.forEach(snap => {
                displayPetCard(snap.data(), snap.id, user);
            })
        }
        else {
            $("#user-pets").append(`No Pets Yet!`);
        }
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
$("#send-form").click(e => {
    e.preventDefault();
    addPet();
})

// ADD PET
function addPet() {

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
function pfpUpdate(type) {
    if (type == "edit") {
        var form = $("#edit-pet");
        var output = $("#edit-pet-pfp");
    }
    else {
        var form = $("#add-pet");
        var output = $("#new-pet-pfp");
    }
    const user = JSON.parse(sessionStorage.getItem("user"));
    upload(form[0].file.files[0], 'temp/' + user.uid, () => {
        download('temp/' + user.uid, url => {
            output.attr("src", url);
            output.css("background-size", "cover");
        })
    })
}

// --> UPDATE

// OPEN EDIT FORM
function editPet(id) {
    db.collection("pets").doc(id).get().then(snapshot => {
        var pet = Object.assign(snapshot.data());
        $($("#edit-pet input")[1])[0].value = pet.name;
        $($("#edit-pet input")[2])[0].value = pet.dob;
        $($("#edit-pet input")[3])[0].value = pet.sex;
        $($("#edit-pet input")[4])[0].value = pet.breed;
        $($("#edit-pet input")[5])[0].value = pet.weight;
        $("#edit-pet-popup").fadeIn();
    })
}
// CLOSE EDIT FORM
$("#close-edit-form").click(e => {
    e.preventDefault();
    $("#edit-pet-popup").fadeOut();
})
// SAVE EDIT
$("#send-edit-form").click(e => {
    e.preventDefault();
    var values = $("#edit-pet input");
    var newPet = { name: "", dob: "", sex: "", breed: "", weight: "" };
    var x = 1;
    for (var key in newPet) {
        if(values[x].value == ""){
            delete newPet[key];
        }
        else{
            if (key == "name") {
                var name = values[x].value;
                name = name.replace(name[0], name[0].toUpperCase());
                newPet[key] = name;
            }
            else {
                newPet[key] = values[x].value;
            }
        }
        x++;
    };
    var id = $("#pet-data").attr("pet-id");
    db.collection("pets").doc(id).update(newPet).then(() => {
        displayPetPage(window.location.href.split('?')[1]);
        $("#edit-pet-popup").fadeOut();
    });
})

// --> DELETE

// DELETE MODAL
function deletePet(id) {
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