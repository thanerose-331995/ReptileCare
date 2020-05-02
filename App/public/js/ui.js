

// ------- PAGE CONTROLS ---

//when browser loads
$(document).ready(() => {
    //nav
    const menus = document.querySelectorAll('.side-menu');
    //M connects to materialize and initialises the menu, specifies open from the right
    M.Sidenav.init(menus, { edge: 'right' });
    //form
    const forms = document.querySelectorAll('.side-form');
    M.Sidenav.init(forms, { edge: 'left' });

    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);

})

//logout
$("#logout-btn").click(e => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log("User Signed Out");
        window.location.href = "../";
    })
})

function closeModal(id) {
    var modal = $("#" + id);
    M.Modal.getInstance(modal).close();
}

function openModal(id) {
    var modal = $("#" + id);
    M.Modal.getInstance(modal).open();
}

// ------- PET DATA -------

// display pet data
function displayPet(data, id) {
    const pets = document.querySelector('.pets');

    //this is a template html
    const html = `
        <div class="card-panel pet light-green lighten-1 row waves-effect" onclick="petClicked('${id}')" data-id="${id}">
            <img class="pet-pfp circle responsive-img">
            <div class="pet-details grey-text text-lighten-3 right-align">
                <div class="pet-title">${data.name}</div>
                <div class="pet-flavour-text">${data.breed} <br> ${data.age} | SEX | WEIGHT</div>
            </div>
        </div>
    `;
    //     <div id="pet-modal-${id}" class="modal">
    //         <div class="modal-content">
    //             <h4><b>${data.name}</b></h4>
    //             <img alt="recipe thumb" class="circle z-depth-2 pet-pfp" id="modal-pet-pfp" style="width:100px;height:auto">
    //             <h6><b>Breed:</b> ${data.breed}</h6>
    //             <h6><b>Age:</b> ${data.age}</h6>
    //             <h6><b>User:</b> ${data.user}</h6>
    //             <br>
    //             <p>ANY MORE PET INFO CAN GO HERE</p>                
    //             <a class="btn-floating btn-small green darken-3 pet-delete" onclick="deletePet('${id}')"><i class="material-icons">delete_outline</i></a>
    //             <a class="btn-floating btn-small green darken-3" onclick="editPet('${id}')"><i class="material-icons">edit</i></a>
    //         </div>
    //     </div>
    //     <div id="pet-edit-modal-${id}" class="modal">
    //         <div class="modal-content">
    //             <form id="edit-pet-form">
    //                 <div class="input-field">
    //                     <input placeholder="${data.name}" name="name" type="text" value="" class="validate">
    //                 </div>
    //                 <img id="edit-pet-profile-pic" class="circle pet-pfp" style="width:50px;height:50px;background-size:cover;">
    //                 <input id="pfp-upload" onchange="pfpUpdate()" type="file" name="file">
    //                 <div class="input-field">
    //                     <input placeholder="${data.age}" name="age" type="number" value="" class="validate">
    //                 </div>
    //                 <div class="input-field">
    //                     <select name="breed">
    //                         <option id="breed" value="" disabled selected>Choose your option</option>
    //                         <option value="Crested Gecko">Crested Gecko</option>
    //                         <option value="Bearded Dragon">Bearded Dragon</option>
    //                         <option value="Leopard Gecko">Leopard Gecko</option>
    //                     </select>
    //                     <label>Breed</label>
    //                 </div>
    //                 <a class="btn btn-small green darken-3" onclick="saveEdit('${id}')"><i class="material-icons">done</i></a>
    //                 <a class="btn btn-small green darken-3" onclick="closeEdit('${id}')"><i class="material-icons">close</i></a>
    //             </form>
    //         </div>
    //     </div>
    // `;

    pets.innerHTML += html;

    const user = JSON.parse(sessionStorage.getItem("user"));
    download("images/" + user.uid + "/" + id + "/pfp", url => {
        if (url.code == null) {
            $(".pet-pfp").attr("src", url);
        }
        else {
            download("images/defaults/lizard.png", url => {
                $(".pet-pfp").attr("src", url);
            })
        }
    })

    $("#pet-modal-" + id).modal();
    $('#pet-edit-modal-' + id).modal();
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
}

//remove from screen
function removePet(id) {
    //attribute selector which looks for pet attribute with this data-id val
    const pet = document.querySelector(`.pet[data-id=${id}]`);
    pet.remove();
}

//open pet modal
function petClicked(id) {
    console.log(id);
    // ./pet.html?${id}
    window.location.href = ("./pet.html?" + id);
    // openModal("pet-modal-" + id);
}

//open edit page
function editPet(id) {
    closeModal("pet-modal-" + id);
    openModal("pet-edit-modal-" + id);
}

//close edit page
function closeEdit(id) {
    closeModal("pet-edit-modal-" + id);
    openModal("pet-modal-" + id);
}

//save edit
function saveEdit(id) {
    newData = objectifyForm($("#pet-edit-modal-" + id).find('form')[0]);
    closeModal("pet-edit-modal-" + id);
    openModal("loader");
    var keys = Object.keys(newData);
    if (keys.includes("file")) {
        const user = JSON.parse(sessionStorage.getItem("user"));
        var url = "images/" + user.uid + "/" + id + "/pfp";
        console.log(url);
        upload($("#edit-pet-form")[0].file.files[0], url, () => { });
    }
    delete newData.file;
    delete newData.select - breed;
    setTimeout(
        function () {
            removePet(id);
            db.collection("pets").doc(id).update(newData).then(() => {
                closeModal("loader");
                getSnapshot();
            });
        }, 2000);
}

function pfpUpdate() {
    const user = JSON.parse(sessionStorage.getItem("user"));

    upload($("#edit-pet-form")[0].file.files[0], 'temp/' + user.uid, () => {
        download('temp/' + user.uid, url => {
            $("#edit-pet-profile-pic").attr("src", url);
        })
    })
}

// ------- CARE SHEET DATA -------

//display all sheets
function displayCareSheets(data, id) {
    var html = `
        <div class="">
            <div class="card light-green lighten-1 z-depth-1">
                <a class="white-text" onclick="careSheetClicked('${id}')">
                    <div class="card-content">
                        <h5 style="margin:0px">${data.breed}</h5>
                    </div>
                </a>
            </div>
        <div id="sheet-modal-${id}" class="modal">
        <div style='width:100%;height:auto;' class="green">
            <h4 style='padding:30px;margin:0px'>${data.breed}</h4>
        </div>
            <div class="modal-content center">
    `;

    for (let [key, value] of Object.entries(data)) {
        var name = key.replace(key[0], key[0].toUpperCase());
        html += `<p><b>${name}:</b> ${value}</p>`;
    }

    html += "</div></div>";
    $("#data-container").append(html);

    var elems = document.querySelectorAll('.modal');
    M.Modal.init(elems);

}

//open sheet modal
function careSheetClicked(id) {
    const modal = $("#sheet-modal-" + id);
    M.Modal.getInstance(modal).open();
}