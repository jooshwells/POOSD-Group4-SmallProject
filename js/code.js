const urlBase = "LAMPAPI";
const extension = "php";

// Track current mode: "login" or "signup"
let toggleMode = "login";

let userId = 0;
let firstName = "";
let lastName = "";

function toggleLoginMode() {
    if(toggleMode === "login") {
        toggleMode = "signup";
        document.getElementById("inner-title").innerText = "PLEASE SIGN UP";
        document.getElementById("authButton").innerText = "Sign Up";
        document.getElementById("toggleButton").innerText = "Switch to Log In";
        document.getElementById("firstName").style.display = "inline-block";
        document.getElementById("lastName").style.display = "inline-block";
        document.getElementById("authResult").innerText = "";
	document.getElementById("signupq").style.display = "none";
    } else {
        toggleMode = "login";
	document.getElementById("signupq").style.display = "block";
        document.getElementById("inner-title").innerText = "PLEASE LOG IN";
        document.getElementById("authButton").innerText = "Log In";
        document.getElementById("toggleButton").innerText = "Switch to Sign Up";
        document.getElementById("firstName").style.display = "none";
        document.getElementById("lastName").style.display = "none";
        document.getElementById("authResult").innerText = "";
    }
}

function doAuth() {
    if(toggleMode === "login"){
        userId = 0;
        firstName = "";
        lastName = "";

        let login = document.getElementById("authName").value;
        let password = document.getElementById("authPassword").value;

        var hash = md5(password);
        document.getElementById("authResult").innerHTML = "";

        let tmp = {
            login: login,
            password: hash
        };

        let jsonPayload = JSON.stringify(tmp);

        let url = urlBase + '/Login.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try {
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                    let jsonObject = JSON.parse(xhr.responseText);
                    userId = jsonObject.id;

                    if (userId < 1) {
                        document.getElementById("authResult").innerHTML = "User/Password combination incorrect";
                        return;
                    }
                    firstName = jsonObject.firstName;
                    lastName = jsonObject.lastName;

                    saveCookie();
                    window.location.href = "loggedin.html";
                }
            };

            xhr.send(jsonPayload);
        } catch (err) {
            document.getElementById("authResult").innerHTML = err.message;
        }
    }
    if(toggleMode === "signup"){
        firstName = document.getElementById("firstName").value;
        lastName = document.getElementById("lastName").value;

        let username = document.getElementById("authName").value;
        let password = document.getElementById("authPassword").value;

        var hash = md5(password);

        document.getElementById("authResult").innerHTML = "";

        let tmp = {
            firstName: firstName,
            lastName: lastName,
            login: username,
            password: hash
        };

        let jsonPayload = JSON.stringify(tmp);

        let url = urlBase + '/Register.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        try {
            xhr.onreadystatechange = function () {

                if (this.readyState != 4) {
                    return;
                }

                if (this.status == 409) {
                    document.getElementById("authResult").innerHTML = "User already exists";
                    return;
                }

                if (this.status == 200) {

                    let jsonObject = JSON.parse(xhr.responseText);
                    userId = jsonObject.id;
                    document.getElementById("authResult").innerHTML = "User added";
                    firstName = jsonObject.firstName;
                    lastName = jsonObject.lastName;
                    saveCookie();
                }
            };

            xhr.send(jsonPayload);
        } catch (err) {
            document.getElementById("authResult").innerHTML = err.message;
        }
    }
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}
