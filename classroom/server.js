const express = require("express");
const app = express();

app.get("/", (req, res)=>{
    res.send("Hi, I am Abhay");
})
//Index route
app.get("/users", (req, res) => {
console.log("You were right");
res.send("kya gunda bnega re tu");
})
//show route
app.get("/users/:id", (req, res) => {
console.log("You were right");
res.send("mai hu don");
})
//post route
app.post("/users", (req, res) => {
console.log("You were right");
res.send("mai wapas aagya");
})

//delete route
app.delete("/users/:id", (req, res) => {
console.log("You were right");
res.send("aa mai to gya");
})


app.listen("3000", ()=>{
    console.log("app is listening to port 3000");
})