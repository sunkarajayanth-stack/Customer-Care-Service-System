const { addTicket, sortPriority, resolveTop, searchTicket } = require("./dsa");

addTicket("Alice","Login error",2);

addTicket("Bob","Payment failed",3);

addTicket("Chris","Password reset",1);

sortPriority();

resolveTop();

searchTicket("Alice");
