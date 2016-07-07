const express = require('express');
const app = express();
const mongo = require('mongodb').MongoClient;


app.get("/:num", (req, res) => {
   var num = Number(req.params.num);
   
   if(!isNaN(num)){
       mongo.connect("mongodb://localhost:27017/url-parser", (err, db) =>{
          if(err)
            throw err;
          else{
              db.collection("url", (err, collection) => {
                 if(err){
                     throw err;
                 }
                 else{
                     collection.findOne({code: num}, (err,doc) => {
                            if(err)
                                throw err;
                                
                            if(doc !== null)    
                                res.redirect(doc.url);
                            else {
                                res.send({Error: "invalid url"});
                                res.end();
                            }
                     });
                 }
              });
             
          }
          
       });
   }
   else{
       res.send({"Error": "invalid url"});
       res.end();
   }
   
   
    
});

app.get("/new/:url", (req, res) => {
   var url = req.params.url;
   var isURL = /^w{3}\..*\.[A-Za-z]{2,3}$/.test(url);
   
   if(isURL){
       mongo.connect("mongodb://localhost:27017/url-parser", (err, db) => {
          if(err)
            throw err;
            
          db.collection("url", (err, collection) => {
             if(err)
                throw err;
            
             var codeNum = Math.floor(Math.random()*9000 + 100);    
             
             
             
             collection.insert({code: codeNum, url: "https://" + url});
             
             res.send({"realURL": "https://" + url, "shorten-url": "https://url-shortener-ledminh.c9users.io/" + codeNum});
          });
       });
   }
   else
        res.send({"Error": "New URL is invalid"});
        
});

app.listen(process.env.PORT);
