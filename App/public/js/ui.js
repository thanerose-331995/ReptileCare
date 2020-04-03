
//when browser loads
document.addEventListener('DOMContentLoaded', function () {
    //connecting up the sidenavs to their content
    //nav
    const menus = document.querySelectorAll('.side-menu');
    //M connects to materialize and initialises the menu, specifies open from the right
    M.Sidenav.init(menus, { edge: 'right' });
    //form
    const forms = document.querySelectorAll('.side-form');
    M.Sidenav.init(forms, { edge: 'left' });

    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
});




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
    `;

    pets.innerHTML += html;
}

function removePet(id) {
    //attribute selector which looks for pet attribute with this data-id val
    const pet = document.querySelector(`.pet[data-id=${id}]`);
    pet.remove();
}

function petClicked(id) {
    getData("pets", id, function (data) {
        console.log(data);
        $(".pet-info-long").append(
            '<div class= "row center">' +
            '<div class="col s12 m6">' +
            '<div class="card">' +
            '<div class="card-content">' +
            '<span class="card-title">Card Title</span>' +
            '<p>I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively.</p>' +
            '</div>' +
            '<div class="card-action">' +
            '<a class="btn-small waves-effect">' +
            '<i class="material-icons">close</i>' +
            '</a>' +
            '</div>' +
            '</div>' +
            '</div >' +
            '</div > '
        );
    });


}