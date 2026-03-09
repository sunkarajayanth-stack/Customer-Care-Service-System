function createTicket(){

let name=document.getElementById("name").value
let issue=document.getElementById("issue").value
let priority=document.getElementById("priority").value
let category=document.getElementById("category").value

addTicket(name,issue,priority,category)

display()

}

function display(){

let list=document.getElementById("ticketList")

list.innerHTML=""

tickets.forEach(t=>{

let li=document.createElement("li")

li.innerHTML=`

${t.name} - ${t.issue}

Priority ${t.priority}

Category ${t.category}

Status ${t.status}

`

list.appendChild(li)

})

updateStats()

}

function updateStats(){

document.getElementById("totalTickets").innerText=tickets.length

document.getElementById("highTickets").innerText=

tickets.filter(t=>t.priority==3).length

document.getElementById("resolvedTickets").innerText=

tickets.filter(t=>t.status=="Resolved").length

}

function searchTicket(){

let name=document.getElementById("searchBox").value

let r=searchCustomer(name)

if(r) alert("Found: "+r.issue)
else alert("Not found")

}

function sortPriority(){

sortPriority()

display()

}

function resolveTicket(){

resolveTop()

display()

}

function logout(){

localStorage.removeItem("logged")

window.location="login.html"

}

display()
