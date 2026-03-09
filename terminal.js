const {addTicket,sortPriority,resolveTop,searchCustomer}=require("./dsa")

addTicket("Alice","Login error",2,"Technical")

addTicket("Bob","Payment failed",3,"Billing")

sortPriority()

resolveTop()

console.log(searchCustomer("Alice"))
