const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

exports.getAstronauts = functions.https.onRequest((req, res) => {
    admin.firestore().collection('managedAstronauts').get().then(data => {
        let managedAstronauts = [];
        data.forEach(doc => {
            managedAstronauts.push(doc.data());
        });
        return res.jsonp(managedAstronauts);
    })
    .catch((err) => console.log(err));
});

exports.createAstronaut = functions.https.onRequest((req, res) => {
    if(req.method !== 'POST'){
        return res.status(400).jsonp({error: "Method not allowed!"});
    }

    const newAstronaut = {
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        superpower: req.body.superpower,
        dateOfBirth: req.body.dateOfBirth
    };

    admin.firestore()
        .collection('managedAstronauts')
        .add(newAstronaut)
        .then(doc => {
            res.json({message: `Astronaut ${newAstronaut.firstName} ${newAstronaut.lastName} was added!`});
        })
        .catch(err => {
            res.status(500).json({ error: "Something Went Wrong =("});
            console.log(err);
        })
})