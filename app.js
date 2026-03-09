const form=document.getElementById("ticketForm");

const list=document.getElementById("ticketList");

form.addEventListener("submit",function(e){

e.preventDefault();

let name=document.getElementById("name").value;

let issue=document.getElementById("issue").value;

let priority=document.getElementById("priority").value;

addTicket(name,issue,priority);

display();

form.reset();

});


function display(){

list.innerHTML="";

tickets.forEach(t=>{

let li=document.createElement("li");

li.innerHTML=`${t.name} - ${t.issue} | Priority ${t.priority}`;

list.appendChild(li);

});

}


document.getElementById("sortBtn").onclick=()=>{

sortPriority();

display();

};


document.getElementById("searchBtn").onclick=()=>{

let name=document.getElementById("searchBox").value;

let r=searchTicket(name);

if(r) alert("Found: "+r.issue);

else alert("Not found");

};


document.getElementById("resolveBtn").onclick=()=>{

resolveTop();

display();

};
