
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

// ------- PET DATA -------


// display pet data
function displayPet(data, id) {
    const pets = document.querySelector('.pets');

    //this is a template html
    const html = `
        <div class="card-panel pet white row waves-effect" onclick="petClicked('${id}')" data-id="${id}">
            <img src="../img/lizard.png" alt="recipe thumb">
            <div class="recipe-details">
                <div class="recipe-title">${data.name}</div>
                <div class="recipe-ingredients">Breed: ${data.breed}, Age: ${data.age}</div>
            </div>
            <div class="recipe-delete">
                <i class="material-icons" data-id="${id}">delete_outline</i>
            </div>
        </div>
        <div id="pet-modal-${id}" class="modal">
            <div class="modal-content center">
                <h4><b>${data.name}</b></h4>
                <img src="../img/lizard.png" alt="recipe thumb" class="responsive-img circle z-depth-2">
                <h6><b>Breed:</b> ${data.breed}</h6>
                <h6><b>Age:</b> ${data.age}</h6>
                <h6><b>User:</b> ${data.user}</h6>
                <br>
                <p>ANY MORE PET INFO CAN GO HERE</p>
            </div>
        </div>
    `;

    pets.innerHTML += html;

    var elems = document.querySelectorAll('.modal');
    M.Modal.init(elems);
}

function removePet(id) {
    //attribute selector which looks for pet attribute with this data-id val
    const pet = document.querySelector(`.pet[data-id=${id}]`);
    pet.remove();
}

function petClicked(id) {
    console.log("check");
    const modal = $("#pet-modal-" + id);
    M.Modal.getInstance(modal).open();
    getData("pets", id, function (data) {
        console.log(data);

        const html = `
            <div>check</div>
        `;

        $(".pet-info-" + id).append(html);
    });
}