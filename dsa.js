let tickets = [];

// Add Ticket

function addTicket(name,issue,priority){

let ticket={

name:name,
issue:issue,
priority:Number(priority),
status:"Open"

};

tickets.push(ticket);

console.log("Ticket Added:",ticket);

updateStats();

}


// Priority Queue (Highest priority first)

function sortPriority(){

tickets.sort((a,b)=>b.priority-a.priority);

console.log("Tickets sorted by priority");

}


// Resolve ticket (queue behavior)

function resolveTop(){

if(tickets.length===0){

console.log("No tickets");

return;

}

let ticket=tickets.shift();

ticket.status="Resolved";

console.log("Resolved:",ticket);

updateStats();

}


// Linear Search

function searchTicket(name){

let result=tickets.find(t=>t.name.toLowerCase()==name.toLowerCase());

if(result){

console.log("Found:",result);

return result;

}

console.log("Not found");

return null;

}


function updateStats(){

let total=tickets.length;

let high=tickets.filter(t=>t.priority==3).length;

document.getElementById("total").textContent=total;

document.getElementById("high").textContent=high;

}
