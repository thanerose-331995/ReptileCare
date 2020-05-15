const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.newUserSignup = functions.auth.user().onCreate(user => {
    return OfflineAudioCompletionEvent.firestore().collection('users').doc(user.uid).set({
        email: user.email
    })
})

exports.userDeleted = functions.auth.user().onDelete(user => {
    //delete user data
    var doc = admin.firestore().collection('users').doc(user.uid);
    return doc.delete();
})

exports.logActivites = functions.firestore.document('/{collection}/{id}')
    .onCreate((snap, context) => {
        const collection = context.params.collection;
        const activities = admin.firestore().collection("activities");

        if (collection === "pets") {
            return activities.add({ text: 'new pet added!' });
        }
        if (collection === "users") {
            return activities.add({ text: 'new user signed up!' });
        }
        return null;
    })