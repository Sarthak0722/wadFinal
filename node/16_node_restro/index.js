const express=require("express");
const fs=require("fs");

const app=express();

app.use(express.static("public"));

app.get("/restro",(req,res)=>
{
    fs.readFile("menu.json",(err,data)=>
    {
        if(err)
        {
            return res.status(500).send("error");
        }
        else
        res.json(JSON.parse(data));
    });
});

app.listen(3000,()=>
console.log("server running on port 3000"));