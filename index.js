/* defaultUsers = {
        'username': 'hitesh patwal',
        'email': 'hiteshpatwal@example.com',
        'password': 'example_password'
    }
*/
let defaultUsers = []; 
const loginPage = 'index.html';
const homePage = 'gym.html';
$(function() {

    // events fires on signup form submit.
    $('#signUpForm').on('submit', function() {
        
        let response = uniqueUserEmail($('#signUpEmail').val());
        if (response.error) {
            alert(response.error);
            return false;
        } else {
            let user = {
                'username': $('#username').val(),
                'email': $('#signUpEmail').val(),
                'password': $('#signUpPassword').val()
            }
            // register a new user.
            registerUser(user);
        }

    });

    $('#loginForm').on('submit', function() {
         let email = $('#loginEmail').val();
         let password = $('#loginPassword').val();
         let user = checkUserExist(email, password);

         if (user != false) {
            localStorage.setItem('username', user.username);
            localStorage.setItem('email', user.email);
            localStorage.setItem('password', user.password);
            loginUser();
         } else {
            alert('You are not registerd in our system. Please sign up and login.')
         }
    });

    $('#logout').click(function() {
        localStorage.removeItem('username')
        localStorage.removeItem('email');
        localStorage.removeItem('password');
        redirectLandingPage();
    });
});

initUsers();

function initUsers() {
    if (typeof defaultUsers[0] != 'undefined' && Object.keys(defaultUsers[0]).length !== 0) {
        registerUser(defaultUsers);
    }
    redirectLandingPage();
   
}

function loginUser() {
    let email = localStorage.getItem('email') || '';
    let password = localStorage.getItem('password') || '';
    let username = localStorage.getItem('username') || "User";
    if (email.length && password.length) {
        if (checkUserExist(email, password) == false) {
            let user = {
                'username': username,
                'email': email,
                'password': password
            }
            registerUser(user);
        }
    }
    redirectLandingPage();

}


function isUserLoggedIn() {
    let email = localStorage.getItem('email') || '';
    let password = localStorage.getItem('password') || '';
    if (email.length && password.length) {
        return true;
    }
    return false;
}

function redirectLandingPage() {
    const landingPage = (isUserLoggedIn()) ?  homePage : loginPage;
    let currentPage = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1)
  
    if (currentPage != landingPage)
        window.location = landingPage;
}


function registerUser(user) {
    let users = JSON.parse(localStorage.getItem('users') || "[]");
    if (!checkUserExist(user.email, user.password))
        users.push(user);

    localStorage.setItem('users', JSON.stringify(users));
}

function uniqueUserEmail(userEmail) {
    let response = {'status': false,'error': null};
    // if username is empty then show error.
    if (userEmail.length == 0 || $.trim(userEmail) == '') {
        response.error = "User email cannot be empty";
    } else {
        if (checkUserValueExist(userEmail)) {
            response.error = "User eamil already exist, try another one.";
        }
    }

    // if there is no error, submit response as true;
    response.status =  !Boolean(response.error);
    return response;
}


function checkUserValueExist(value, element = 'email') {
    let isEmailExist = false;
    let registeredUsers = JSON.parse(localStorage.getItem('users') || "[]");
    $.each(registeredUsers, function(key, credentials) {
        if (credentials[element] == value) {
            isEmailExist = true;
        }
    });
    return isEmailExist;
}

function checkUserExist(email, password) {
    let UserExist = false;
    let registeredUsers = JSON.parse(localStorage.getItem('users') || "[]");
    $.each(registeredUsers, function(key, credentials) {
        if (credentials['email'] == email && credentials['password'] == password) {
            UserExist = credentials;
        }
    });

    return UserExist;
}

function setCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0)
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function deleteCookie(name) {
    setCookie(name, "", -1);
}