let tickets=JSON.parse(localStorage.getItem("tickets"))||[]

// add ticket

function addTicket(name,issue,priority,category){

let ticket={

name,
issue,
priority:Number(priority),
category,
status:"Open"

}

tickets.push(ticket)

save()

return ticket

}

// priority queue

function sortPriority(){

tickets.sort((a,b)=>b.priority-a.priority)

save()

}

// resolve

function resolveTop(){

if(tickets.length===0)return

let t=tickets.shift()

t.status="Resolved"

save()

}

// search

function searchCustomer(name){

return tickets.find(t=>t.name.toLowerCase()==name.toLowerCase())

}

function save(){

localStorage.setItem("tickets",JSON.stringify(tickets))

}
