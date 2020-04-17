//----------- STATE CHANGE

auth.onAuthStateChanged(user => {
    console.log(user);
    if (user) {
        //user is logged in
        console.log("User Logged In:", user);
        sessionStorage.setItem("user", JSON.stringify(user));
        window.location.href = "./pages/main.html";
        console.log("check");
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

    delete user.password;

    //formatting name
    user.first_name = user.first_name.replace(user.first_name[0], user.first_name[0].toUpperCase());
    user.last_name = user.last_name.replace(user.last_name[0], user.last_name[0].toUpperCase());

    auth.createUserWithEmailAndPassword(user.email, user.password).then(cred => {
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
