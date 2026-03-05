
// Array to store tickets
let tickets = [];

// Form submit event

document.getElementById("ticketForm").addEventListener("submit", function(e){

e.preventDefault();

let name = document.getElementById("name").value;
let email = document.getElementById("email").value;
let issue = document.getElementById("issue").value;

// Object
let ticket = {
name:name,
email:email,
issue:issue
};

// Add to array
tickets.push(ticket);

// Display tickets
displayTickets();

// Reset form
this.reset();

});

// Function
function displayTickets(){

let list = document.getElementById("ticketList");
list.innerHTML="";

tickets.forEach(function(ticket){

let li=document.createElement("li");

li.innerHTML=
"<strong>"+ticket.name+"</strong> - "+ticket.issue;

list.appendChild(li);

});

}

// Fetch API Example

document.getElementById("loadTips").addEventListener("click", function(){

fetch("https://jsonplaceholder.typicode.com/posts?_limit=3")

.then(response=>response.json())

.then(data=>{

let tips=document.getElementById("tips");

tips.innerHTML="";

data.forEach(post=>{

let li=document.createElement("li");

li.textContent=post.title;

tips.appendChild(li);

});

});

});