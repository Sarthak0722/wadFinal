const express=require("express");
const fs=require("fs");
const app=express();

app.use(express.static("public"));

app.get("/api/products", (req,res)=>
{
    fs.readFile("products.json",(err,data)=>
    {
        if(err)
        {
            return res.status(500).send("error reading file");
        }
        else
        res.json(JSON.parse(data));
    });
});

app.listen(3000, ()=>
console.log("server running on port 3000"));