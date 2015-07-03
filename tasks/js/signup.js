"use strict";

/*
    signup.js
    Script for the signup.html page
    Handle the form submit and create a new Parse.User() for the new user account
 */

//use jQuery to register a function that is called when the document is ready for manipulation
$(function() {
    $('.form-signup'').submit(function(e) {
        e.preventDefault();
        var user = new Parse.User();
        user.set('username', $('#inputEmail').val());
        user.set('password', $('#inputPassword').val());
        user.set('firstname', $('#inputFName').val());
        user.set('lastname', $('#inputLName').val());
        user.signUp().then(function() {
            clearError();
            window.location = "index.html";
        }, function(err) {
            showError(err);
        });
    });
});