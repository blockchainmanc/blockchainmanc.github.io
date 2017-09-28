function addEmail(email) {
    let newEmail = firebase.database().ref('raw-emails').push();
    newEmail
        .set({
            email: email,
            created: Date.now(),
        })
        .then(function () {
            $('#email-msg').text('Thanks for signing up!');
            $('#email-signup-form-components').hide();
        });
}

$('#mailing-list-form').submit(function (event) {
    event.preventDefault();
    let email = $('#email').val();
    if (email) {
        addEmail(email)
    }
});