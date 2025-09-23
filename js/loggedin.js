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
let jsonResponse;

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

let searchMode =0;
function search(){
    console.log(jsonResponse.results);  
    //
    let searchQuery= document.getElementById("search").value.toLowerCase()
    if(searchQuery==""){

            document.querySelector(".tensB").style.display ="table";
            document.getElementById("Result").style.display ="none";         
            document.getElementById("searchTitle").style.display ="none";
            searchMode = 0;

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
    searchMode=1;
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
    document.getElementById("tens").style.display = "none";
    document.getElementById("searchTitle").style.display = "none";
    document.getElementById("load").style.display = "none";


    }
    else{
        document.getElementById("contactTable").style.display = "none";
        document.getElementById("hint").style.display = "block"
        document.getElementById("tens").style.display = "table";
        document.getElementById("load").style.display = "block";



    }
}

let contactsShown = 10;
function displayTen(){
    if (jsonResponse.results == null) // empty check
        return;
    if(searchMode==1){
document.getElementById("loadWarning").style.display= "block";
setTimeout(() => {
document.getElementById("loadWarning").style.display= "none";
    }, 3000);

}
            else{
    let tablebody = document.getElementById("tensBody");
    for(let i=contactsShown-10;i<contactsShown && i < jsonResponse.results.length;i++){
        let contact = jsonResponse.results[i];  
        let tablerow= document.createElement("tr");
                tablerow.innerHTML = 
                "<td>" + contact.FirstName + "</td>" +
                "<td>" + contact.LastName + "</td>" +
                "<td>" + contact.PhoneNumber + "</td>" +
                "<td>" + contact.EmailAddress + "</td>"

                let actionCell = document.createElement("td");

                let editBtn = document.createElement("button");
                editBtn.classList.add("editButton");
                editBtn.id = "editButton" + i;
                //editBtn.innerText = "Edit";
                editBtn.onclick = function() { editRow(i); };

                let saveBtn = document.createElement("button");
                saveBtn.classList.add("saveButton");
                saveBtn.id = "saveButton" + i;
                saveBtn.innerText = "Save";
                saveBtn.style.display = "none";
                saveBtn.onclick = function() { saveRow(i); };

                actionCell.appendChild(editBtn);
                actionCell.appendChild(saveBtn);
                tablerow.appendChild(actionCell);

                let deleteCell = document.createElement("td");
                let deleteBtn = document.createElement("button");
                deleteBtn.classList.add("deleteButton");
                //deleteBtn.innerText = "Delete";
                deleteCell.appendChild(deleteBtn);
                tablerow.appendChild(deleteCell);
		        deleteBtn.onclick = function() { 
                    if(confirm("Are you sure you want to delete this contact?"))
                        deleteRow(i); 
                };

                tablebody.appendChild(tablerow);
    }
    contactsShown+=10;
}
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

            document.getElementById("contactTableBody").innerHTML = "";
            document.getElementById("tensBody").innerHTML = "";

            if (contactData.results && contactData.results.length > 0) {

                displayTen(); 
                
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
                    deleteCell.appendChild(deleteBtn);
                    tablerow.appendChild(deleteCell);
                    deleteBtn.onclick = function() { 
                        if(confirm("Are you sure you want to delete this contact?"))
                            deleteRow(index); 
                    };

                    document.getElementById("contactTableBody").appendChild(tablerow);
                    allContactIds[index] = contact.ID;
                });
            } else {
                console.log("No Records Found.");
            }
        } else {
            console.log("Error loading contacts from server. Status:", xhr.status);
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
    document.getElementById("addContactResult").innerHTML = "";
    document.getElementById("firstN").value ="";
    document.getElementById("lastN").value="";
    document.getElementById("phoneN").value="";
    document.getElementById("email").value="";
}

function addContact(){
    document.querySelector(".addContactPB").style.opacity = "1";
    document.querySelector(".addContactPB").style.display = "block";
    document.getElementById("addContactResult").innerHTML = "";
}

function editRow(id) {
    // Hide edit, show save
    document.getElementById("editButton" + id).style.display = "none";
    document.getElementById("saveButton" + id).style.display = "inline-block";

    // Find the correct row in the visible table
    let table = document.getElementById("contactTable").style.display === "table" ? document.getElementById("contactTable") : document.getElementById("tens");
    let row = table.rows[id + 1]; // +1 to skip header row

    if (!row) {
        // Fallback for tens table if index is off
        const tensBody = document.getElementById("tensBody");
        const rows = tensBody.getElementsByTagName("tr");
        for (let i = 0; i < rows.length; i++) {
            const button = rows[i].querySelector(`#editButton${id}`);
            if (button) {
                row = rows[i];
                break;
            }
        }
    }


    if (row) {
        var fNameId = row.cells[0];
        var fNameData = fNameId.innerText;
        var lNameId = row.cells[1];
        var lNameData = lNameId.innerText;
        var pNumId = row.cells[2];
        var phoneData = pNumId.innerText;
        var emailId = row.cells[3];
        var emailData = emailId.innerText;

        fNameId.innerHTML = "<input type='text' id='newFName" + id + "' value='" + fNameData + "'>";
        lNameId.innerHTML = "<input type='text' id='newLName" + id + "' value='" + lNameData + "'>";
        pNumId.innerHTML = "<input type='text' id='newPhone" + id + "' value='" + phoneData + "'>";
        emailId.innerHTML = "<input type='text' id='newEmail" + id + "' value='" + emailData + "'>";
    }
}

function verifyContact(){
    //Declare variables and assign
    let fName = document.getElementById("firstN").value;
    let lName = document.getElementById("lastN").value;
    let num = document.getElementById("phoneN").value;
    let em = document.getElementById("email").value;
    let addContactResult = document.getElementById("addContactResult");
    addContactResult.innerHTML = "";

    // Phone number validation using regex
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    if (!phoneRegex.test(num)) {
        addContactResult.innerHTML = "Invalid phone number format. Use 123-456-7890.";
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(em)) {
        addContactResult.innerHTML = "Invalid email address format.";
        return;
    }


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
                addContactResult.innerHTML = "";
                document.querySelector(".addContactPB").style.display = "none";
                console.log("Contact Added" );

                displayContacts();
            }
            else if(xhr.status==400){
                let response = JSON.parse(xhr.responseText);
                addContactResult.innerHTML = response.error;
            }
            else if(xhr.status==409){
                console.log("Contact already exists!");
                addContactResult.innerHTML = "Contact already exists!";
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

}

function saveRow(id) {
    var namefVal = document.getElementById("newFName" + id).value;
    var namelVal = document.getElementById("newLName" + id).value;
    var phoneVal = document.getElementById("newPhone" + id).value;
    var emailVal = document.getElementById("newEmail" + id).value;
    var idVal = allContactIds[id]

    let table = document.getElementById("contactTable").style.display === "table" ? document.getElementById("contactTable") : document.getElementById("tens");
    let row = table.rows[id + 1]; // +1 to skip header row

    if (!row) {
        // Fallback for tens table if index is off
        const tensBody = document.getElementById("tensBody");
        const rows = tensBody.getElementsByTagName("tr");
        for (let i = 0; i < rows.length; i++) {
            const button = rows[i].querySelector(`#saveButton${id}`);
            if (button) {
                row = rows[i];
                break;
            }
        }
    }

    if (row) {
        row.cells[0].innerHTML = namefVal;
        row.cells[1].innerHTML = namelVal;
        row.cells[2].innerHTML = phoneVal;
        row.cells[3].innerHTML = emailVal;
    }


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
