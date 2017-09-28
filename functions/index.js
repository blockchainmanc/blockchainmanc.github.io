var functions = require('firebase-functions');


exports.deDupe = functions.database.ref('/raw-emails/{pushId}')
    .onWrite(event => {
        // Grab the current value of what was written to the Realtime Database.
        const original = event.data.val();
        // console.log('Uppercasing', event.params.pushId, original);
        // const uppercase = original.toUpperCase();
        // You must return a Promise when performing asynchronous tasks inside a Functions such as
        // writing to the Firebase Realtime Database.
        // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
        // event.data.ref.parent.child('uppercase').set(uppercase);

        let cleanEmails = functions.database.ref('clean-emails');

        cleanEmails.on('value', function(snapshot) {
            let emails = snapshot.val();
            let found = (emails || []).any(function(value) {
                return value.email === original.email;
            });

            if (found) {
                console.log('found duplicate');
                return functions.database.ref(`/raw-emails/${event.params.pushId}`).remove();
            } else {
                let newEmail = functions.database.ref('clean-emails').push();
                return newEmail
                    .set(original)
                    .then(function() {
                        console.log('email moved');
                        return functions.database.ref(`/raw-emails/${event.params.pushId}`).remove();
                    });
            }

        });
    });