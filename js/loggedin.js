/* Commented line swapped for line below comment for local testing
const urlBase = "./LAMPAPI";
 */
const urlBase = "http://localhost:8000/LAMPAPI";

const extension = "php";

// Track current mode: "login" or "signup"
let toggleMode = "login";

let userId = 0;
let firstName = "";
let lastName = "";

let jsonResponse;

function search(){
    console.log(jsonResponse.results);  
    //
    let searchQuery= document.getElementById("search").value.toLowerCase()
        let searchResults = jsonResponse.results.filter(contact=>Object.values(contact).some(value=>
            value.toLowerCase().includes(searchQuery)
        )
    );
        let tablebody = document.getElementById("ResultBody");
        tablebody.innerHTML ="";
        searchResults.forEach(function(contact) {
                let tablerow= document.createElement("tr");
                tablerow.innerHTML = 
                "<td>" + contact.FirstName + "</td>" +
                "<td>" + contact.LastName + "</td>" +
                "<td>" + contact.Phone + "</td>" +
                "<td>" + contact.Email + "</td>"
                tablebody.appendChild(tablerow);
                console.log(contact.FirstName);

    })
        
        
//

    document.getElementById("Result").style.display ="table";
    document.getElementById("contactTable").style.display ="none";

}

function displayAll(){
    document.getElementById("contactTable").style.display = "table";
    document.getElementById("Result").style.display = "none";
}

function displayContacts(){

let xhr= new XMLHttpRequest();
let url= urlBase + "/SearchContact."+ extension;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    let payload = { userId: userId };
    xhr.onload = function(){
        if(xhr.status==200){
            var contactData = JSON.parse(xhr.responseText);
            jsonResponse = contactData;
            if (contactData.error) {
                console.log("Error:", contactData.error);
                return;
            }
            
            let tablebody = document.getElementById("contactTable");

        contactData.results.forEach(function(contact) {
                let tablerow= document.createElement("tr");
                tablerow.innerHTML = 
                "<td>" + contact.FirstName + "</td>" +
                "<td>" + contact.LastName + "</td>" +
                "<td>" + contact.Phone + "</td>" +
                "<td>" + contact.Email + "</td>";

                let deleteBtn = document.createElement("button");
                deleteBtn.classList.add("deleteButton");
                let editBtn = document.createElement("button");
                editBtn.classList.add("editButton");
                let buttonCell = document.createElement("td");
                buttonCell.append(deleteBtn, editBtn);
                tablerow.appendChild(buttonCell);


                /*
            let newCell = document.createElement("td");



            
            newCell.append(deleteBtn, editBtn);*/
            tablebody.appendChild(tablerow);
            


            });
        
}else{
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
    document.querySelector("body").style.backgroundColor = "rgba(206,153,153,1)";

}

function cancelAdd(){
    document.querySelector(".addContactPB").style.display = "none";
    document.querySelector("body").style.backgroundColor = "rgba(206,153,153,1)";
}

function addContact(){
        document.querySelector(".addContactPB").style.opacity = "1";

    document.querySelector(".addContactPB").style.display = "block";
    document.querySelector("body").style.backgroundColor = "rgba(206,153,153,0.5)";


}