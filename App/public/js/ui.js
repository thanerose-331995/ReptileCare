
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
    var instances = M.FormSelect.init(elems, options);
});



// display pet data
function displayPet(data, id) {
    const pets = document.querySelector('.pets');
    console.log(pets)

    //this is a template html
    const html = `
        <div class="card-panel pet white row" data-id="${id}">
            <img src="./img/dish.png" alt="recipe thumb">
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

function removePet(id){
    //attribute selector which looks for pet attribute with this data-id val
    const pet = document.querySelector(`.pet[data-id=${id}]`);
    pet.remove();
}