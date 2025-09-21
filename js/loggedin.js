/* Commented line swapped for line below comment for local testing
const urlBase = "./LAMPAPI";
 */
const urlBase = "/LAMPAPI";

const extension = "php";


// Track current mode: "login" or "signup"
let toggleMode = "login";

let userId = 0;
const allContactIds = []
let firstName = "";
let lastName = "";
let contactId;

function readCookie() {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for(let i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if(tokens[0] === "userId") {
            userId = parseInt(tokens[1].trim());
        }
        else if(tokens[0] === "firstName") {
            firstName = tokens[1];
        }
        else if(tokens[0] === "lastName") {
            lastName = tokens[1];
        }
    }

    if(userId < 0) {
        window.location.href = "index.html";
    } else {
        console.log("Logged in userId:", userId, "Name:", firstName, lastName);
    }
}
readCookie();
displayContacts();

let jsonResponse;

function search(){
    console.log(jsonResponse.results);  
    //
    let searchQuery= document.getElementById("search").value.toLowerCase()
    if(searchQuery==""){

            document.querySelector(".tensB").style.display ="table";
            document.getElementById("Result").style.display ="none";         
            document.getElementById("searchTitle").style.display ="none";


    }else{
        let searchResults = jsonResponse.results.filter(contact=>Object.values(contact).some(value=>
            value && value.toString().toLowerCase().includes(searchQuery)
        )
    );
        let tablebody = document.getElementById("ResultBody");
        tablebody.innerHTML ="";
        searchResults.forEach(function(contact) {
                let tablerow= document.createElement("tr");
                tablerow.innerHTML = 
                "<td>" + contact.FirstName + "</td>" +
                "<td>" + contact.LastName + "</td>" +
                "<td>" + contact.PhoneNumber + "</td>" +
                "<td>" + contact.EmailAddress + "</td>"
                tablebody.appendChild(tablerow);

    })
        
        
//
    document.getElementById("searchTitle").style.display = "block";
    document.getElementById("Result").style.display ="table";
    document.getElementById("contactTable").style.display ="none";
    document.querySelector(".tensB").style.display ="none";
}

}

let contactShow = 0;
function displayAll(){
   contactShow+=1
    if (contactShow%2!=0){
    
    document.getElementById("contactTable").style.display = "table";
    document.getElementById("Result").style.display = "none";
    document.getElementById("hint").style.display = "none";
    document.querySelector(".tensB").style.display = "none";

    }
    else{
        document.getElementById("contactTable").style.display = "none";
        document.getElementById("hint").style.display = "block"
        document.querySelector(".tensB").style.display = "table";

    }
}

let contactsShown = 10;
function displayTen(){
    let tablebody = document.getElementById("tensBody");
    for(let i=contactsShown-10;i<contactsShown && i < jsonResponse.results.length;i++){
        let contact = jsonResponse.results[i];  
        let tablerow= document.createElement("tr");
                tablerow.innerHTML = 
                "<td>" + contact.FirstName + "</td>" +
                "<td>" + contact.LastName + "</td>" +
                "<td>" + contact.PhoneNumber + "</td>" +
                "<td>" + contact.EmailAddress + "</td>"
                tablebody.appendChild(tablerow);
    }
    contactsShown+=10;
};

function displayContacts(){

    let xhr = new XMLHttpRequest();
    let url = urlBase + "/SearchContact." + extension;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    let payload = {
        userId: userId,
        search: document.getElementById("search").value.trim()
    };
    xhr.onload = function(){
        if(xhr.status == 200){
            var contactData = JSON.parse(xhr.responseText);
            jsonResponse = contactData;
            if (contactData.error) {
                console.log("Error:", contactData.error);
                return;
            }

            displayTen();

            let tablebody = document.getElementById("contactTableBody");
            tablebody.innerHTML = "";

            contactData.results.forEach(function(contact, index) {
                let tablerow = document.createElement("tr");
                tablerow.innerHTML =
                "<td id='firstN" + index + "'>" + contact.FirstName + "</td>" +
                "<td id='lastN" + index + "'>" + contact.LastName + "</td>" +
                "<td id='phoneN" + index + "'>" + contact.PhoneNumber + "</td>" +
                "<td id='email" + index + "'>" + contact.EmailAddress + "</td>";

                let actionCell = document.createElement("td");
                actionCell.classList.add("actionCell");

                let editBtn = document.createElement("button");
                editBtn.classList.add("editButton");
                editBtn.id = "editButton" + index;
                //editBtn.innerText = "Edit";
                editBtn.onclick = function() { editRow(index); };

                let saveBtn = document.createElement("button");
                saveBtn.classList.add("saveButton");
                saveBtn.id = "saveButton" + index;
                saveBtn.innerText = "Save";
                saveBtn.style.display = "none";
                saveBtn.onclick = function() { saveRow(index); };

                actionCell.appendChild(editBtn);
                actionCell.appendChild(saveBtn);
                tablerow.appendChild(actionCell);

                let deleteCell = document.createElement("td");
                let deleteBtn = document.createElement("button");
                deleteBtn.classList.add("deleteButton");
                //deleteBtn.innerText = "Delete";
                deleteCell.appendChild(deleteBtn);
                tablerow.appendChild(deleteCell);
		        deleteBtn.onclick = function() { deleteRow(index); };

                tablebody.appendChild(tablerow);

		allContactIds[index] = contact.ID;
            });

        } else {
            console.log("Error");
        }
    };

    xhr.send(JSON.stringify(payload));
}

function verifyContact(){
//Declare variables and assign
let fName = document.getElementById("firstN").value;
let lName = document.getElementById("lastN").value;
let num = document.getElementById("phoneN").value;
let em = document.getElementById("email").value;


//Take input

let tmp = {
    firstName: fName,
    lastName: lName,
    phone: num,
    email: em,
    userId: userId,
}

//
let xhr= new XMLHttpRequest();
let url= urlBase + "/AddContact."+ extension;
xhr.open("POST", url, true)
xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");


//
try{
xhr.onload = function(){
if (xhr.status==200){

    //Clear it out
document.getElementById("firstN").value ="";
document.getElementById("lastN").value="";
document.getElementById("phoneN").value="";
document.getElementById("email").value="";

    console.log("Contact Added" );

    displayContacts();
}
else if(xhr.status==409){
console.log("Contact already exists!");
}
else{
    console.log("Contact NOT Added", xhr.status);
}

}
xhr.send(JSON.stringify(tmp));

}
catch(err){
        console.error(err);
}


    document.querySelector(".addContactPB").style.display = "none";

}

function cancelAdd(){
    document.querySelector(".addContactPB").style.display = "none";
}

function addContact(){
        document.querySelector(".addContactPB").style.opacity = "1";

    document.querySelector(".addContactPB").style.display = "block";


}

function editRow(id) {
    document.getElementById("editButton" + id).style.display = "none";
    document.getElementById("saveButton" + id).style.display = "inline-block";

    var fNameId = document.getElementById("firstN" + id);
    var fNameData = fNameId.innerText;
    var lNameId = document.getElementById("lastN" + id);
    var lNameData = lNameId.innerText;
    var pNumId = document.getElementById("phoneN" + id);
    var phoneData = pNumId.innerText;
    var emailId = document.getElementById("email" + id);
    var emailData = emailId.innerText;

    fNameId.innerHTML = "<input type='text' id='newFName" + id + "' value='" + fNameData + "'>";
    lNameId.innerHTML = "<input type='text' id='newLName" + id + "' value='" + lNameData + "'>";
    pNumId.innerHTML = "<input type='text' id='newPhone" + id + "' value='" + phoneData + "'>";
    emailId.innerHTML = "<input type='text' id='newEmail" + id + "' value='" + emailData + "'>";
}

function saveRow(id) {
    var namefVal = document.getElementById("newFName" + id).value;
    var namelVal = document.getElementById("newLName" + id).value;
    var phoneVal = document.getElementById("newPhone" + id).value;
    var emailVal = document.getElementById("newEmail" + id).value;
    var idVal = allContactIds[id]

    document.getElementById("firstN" + id).innerHTML = namefVal;
    document.getElementById("lastN" + id).innerHTML = namelVal;
    document.getElementById("phoneN" + id).innerHTML = phoneVal;
    document.getElementById("email" + id).innerHTML = emailVal;

    document.getElementById("editButton" + id).style.display = "inline-block";
    document.getElementById("saveButton" + id).style.display = "none";

    let tmp = {
    firstName: namefVal,
    lastName: namelVal,
    phone: phoneVal,
    email: emailVal,
    userId: userId,
    contactId: allContactIds[id]
}

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + "/UpdateContact." + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                displayContacts();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function deleteRow(id) {
    var fNameVal = document.getElementById("firstN" + id).innerText;
    var lNameVal = document.getElementById("lastN" + id).innerText;
    userFName = fNameVal.substring(0, fNameVal.length);
    userLName = fNameVal.substring(0, lNameVal.length);
    let row = document.getElementById("row" + contactId);
    if (row) row.remove();
    let tmp = {
        firstName: userFName,
        lastName: userLName,
        userId: userId,
	    contactId: allContactIds[id]
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/DeleteContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                displayContacts();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }

}
