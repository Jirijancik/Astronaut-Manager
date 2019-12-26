const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
admin.initializeApp();

exports.getAstronauts = functions.region("europe-west1").https.onRequest((req, res) => {
    return cors(req, res, () => {
        admin
            .firestore()
            .collection('managedAstronauts')
            .get()
            .then(data => {
                let managedAstronauts = [];
                data.forEach(doc => {
                    managedAstronauts.push({
                        astronautId: doc.id,
                        lastName: doc.data().lastName,
                        firstName: doc.data().firstName,
                        superpower: doc.data().superpower,
                        dateOfBirth: doc.data().dateOfBirth,
                        gender: doc.data().gender
                    });
                });
                return res.json(managedAstronauts);
            }).catch((err) => console.log(err));
    })
});


exports.createAstronaut = functions.region("europe-west1").https.onRequest((req, res) => {
    if (req.method !== 'POST') {
        return res.status(400).json({ error: "Method not allowed!" });
    }

    const newAstronaut = {
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        superpower: req.body.superpower,
        dateOfBirth: req.body.dateOfBirth,
        gender: req.body.gender
    };

    admin.firestore()
        .collection('managedAstronauts')
        .add(newAstronaut)
        .then(doc => {
            res.json({ message: `Astronaut ${newAstronaut.firstName} ${newAstronaut.lastName} was added!` });
        })
        .catch(err => {
            res.status(500).json({ error: "Something Went Wrong =(" });
            console.log(err);
        })
})