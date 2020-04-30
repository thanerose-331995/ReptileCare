//----------- STATE CHANGE


auth.onAuthStateChanged(user => {
    console.log(user);
    if (user) {
        //user is logged in
        console.log("User Logged In:", user);
        sessionStorage.setItem("user", JSON.stringify(user));
        var state = window.location.href.indexOf("http") != 0 ? "live" : "dev";
        console.log("state:", state);
        window.location.href = state == "live" ? "https://petapp-616ba.web.app/pages/main.html" : "./pages/main.html";
    }
    else {
        console.log("User Logged Out");
    }
})


//---------- FORM HANDLING

//SIGN UP
$("#signup").submit(e => {
    e.preventDefault();
    const user = objectifyForm($("#signup").serializeArray());


    //formatting name
    user.first_name = user.first_name.replace(user.first_name[0], user.first_name[0].toUpperCase());
    user.last_name = user.last_name.replace(user.last_name[0], user.last_name[0].toUpperCase());
    console.log(user.email, user.password);
    auth.createUserWithEmailAndPassword(user.email, user.password).then(cred => {
        delete user.password;
        return db.collection("users").doc(cred.user.uid).set(user);
    }).then(() => {
        const modal = $("#modal-signup");
        M.Modal.getInstance(modal).close();
    });
})

//LOGIN
$("#login").submit(e => {
    e.preventDefault();
    const user = objectifyForm($("#login").serializeArray());
    auth.signInWithEmailAndPassword(user.email, user.password).then(cred => {
        const modal = $("#modal-login");
        M.Modal.getInstance(modal).close();
    });
})
