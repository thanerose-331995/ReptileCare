
// ------- USERS ----------

// ------- STATUS CHECK ---

//check login status
function checkLogin() {
    console.log("logged in: ", sessionStorage.getItem("logged_in"));
    //if session 'logged in' is true
    if (sessionStorage.getItem("logged_in")) {
        //redirect to main if not there
        if (window.location.href != "../index.html") {
            window.location.href = "../index.html";
        }
    } else {
        //else go to signup/login
        window.location.href = "./pages/signup_login.html";
    }
}


// ------- FORMS ----------

// signup / login
function showForm(i, j) {
    $($(i).parent()).parent().addClass("hide");
    $(j).removeClass("hide");
}

//validate form
$(document).keypress(function (e) {
    //assign form depending on which one is visable
    var form = ($(".login-form").is(":visible")) ? $(".login-form")
            : ($(".signup-form").is(":visible")) ? $(".signup-form")
            : null;

    //if object exists
    if (form !== null) {
        var validate = true;
        //if all values are not empty
        $.each($(form).find("input"), (key, val) => {
            if (val.value == "") {
                validate = false;
            }
        });
        // validate = true; //debugging
        //enable submit
        validate ? $(form).find("button").removeClass("disabled") : null;
    }
});


// ------- DB HANDLING ----

//SIGNUP
function addUser() {
    const form = ($('.signup-form').find('form'))[0];

    //formatting
    const first = form.first_name.value.replace(form.first_name.value[0], form.first_name.value[0].toUpperCase());
    const last = form.last_name.value.replace(form.last_name.value[0], form.last_name.value[0].toUpperCase());

    const user = {
        firstName: first,
        lastName: last,
        username: form.username.value,
        email: form.email.value,
        password: form.password.value
    }

    console.log("sign up: ", user);

    //check if emails in use
    db.collection('users').where('email', '==', user.email).get().then((snapshot) => {
        if (snapshot.empty) {
            //check if usernames in use
            db.collection('users').where('username', '==', user.username).get().then((snapshot) => {
                if (snapshot.empty) {
                    //then sign up
                    $("#signup-err").html("");
                    db.collection('users').add(user).catch(err => { console.log(err) });
                    sessionStorage.setItem("currentUser", user.username);
                    //set logged in to true
                    sessionStorage.setItem("logged_in", true);
                    checkLogin();
                }
                else {
                    $(".signup-form").append("<p class='err'>Sorry, this username is already in use.</p>");
                }
            });
        }
        else {
            $(".signup-form").append("<p class='err'>Sorry, this email is linked to a different account.</p>");
        }
    });
}

//LOGIN
function login() {
    const form = ($('.login-form').find('form'))[0];

    const user = {
        username: form.username.value,
        password: form.password.value
    }

    console.log("login: ", user);
    db.collection('users').where('username', '==', user.username).get().then((snapshot) => {
        if (!snapshot.empty) {
            snapshot.docs.forEach(doc => {  
                if (doc.data().password === user.password) {
                    sessionStorage.setItem("currentUser", doc.data().username);
                    sessionStorage.setItem("logged_in", true);
                    checkLogin();
                }
                else {
                    $(".login-form").append("<p class='err'>Password is incorrect.</p>");
                }
            })
        }
        else {
            $(".login-form").append("<p class='err'>Username is incorrect.</p>");
        }
    })
}

//THIS IS WIP - check username avalibilty on the fly
$('.signup-form').find('#username').on('keyup', () => {
    var user = $('.signup-form').find('#username')[0].value;
    db.collection('users').where('username', '==', user).get().then((snapshot) => {
        if (snapshot.empty && (user.length > 3)) {
            console.log("username available");

        }
        else {
            console.log("username taken");
        }
    })
})