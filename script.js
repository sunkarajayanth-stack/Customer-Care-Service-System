body{
font-family: Arial;
margin:0;
background:#f4f4f4;
}

header{
background:#333;
color:white;
padding:15px;
text-align:center;
}

nav a{
color:white;
margin:10px;
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
}

form{
display:flex;
flex-direction:column;
}

input, textarea{
padding:10px;
margin:10px 0;
}

button{
padding:10px;
background:#007BFF;
color:white;
border:none;
cursor:pointer;
}

button:hover{
background:#0056b3;
}

ul{
list-style:none;
padding:0;
}

li{
padding:10px;
border-bottom:1px solid #ddd;
}

footer{
text-align:center;
padding:10px;
background:#333;
color:white;
}

/* Responsive Layout */

@media (max-width:768px){

nav{
display:flex;
flex-direction:column;
}

section{
margin:10px;
}

}
