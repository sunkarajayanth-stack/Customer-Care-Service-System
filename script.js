body{
font-family:Arial;
margin:0;
background:#ecf0f1;
}

header{
background:#34495e;
color:white;
padding:20px;
text-align:center;
}

nav ul{
display:flex;
justify-content:center;
list-style:none;
padding:0;
}

nav li{
margin:10px;
}

nav a{
color:white;
text-decoration:none;
}

main{
padding:20px;
}

section{
background:white;
padding:20px;
margin-bottom:20px;
border-radius:8px;
box-shadow:0 3px 8px rgba(0,0,0,0.1);
}

form{
display:flex;
flex-direction:column;
}

input, textarea, select{
padding:10px;
margin:10px 0;
border-radius:5px;
border:1px solid #ccc;
}

button{
padding:10px;
background:#3498db;
color:white;
border:none;
cursor:pointer;
border-radius:5px;
}

button:hover{
background:#2980b9;
}

ul{
list-style:none;
padding:0;
}

.ticket{
padding:12px;
border-bottom:1px solid #ddd;
}

.priority-high{
color:red;
font-weight:bold;
}

.priority-medium{
color:orange;
}

.priority-low{
color:green;
}

footer{
background:#34495e;
color:white;
text-align:center;
padding:10px;
}

@media(max-width:768px){

nav ul{
flex-direction:column;
align-items:center;
}

}
