const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var uri = "mongodb://davidjimichael:Yell0w$tone@ds045507.mlab.com:45507/mic";
var options = {
    useNewUrlParser: true
};
mongoose.connect(uri, options);

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
    var taskSchema = new mongoose.Schema({
        issueId: String,
        description: String,
        severity: String,
        assignedTo: String,
        open: Boolean
    });

    var Task = mongoose.model("Task", taskSchema);

    const app = express();

    app.use(express.static("public"));
    app.use(bodyParser.json()); // support json encoded bodies
    app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies

    app.get("/", function(req, res) {

        res.status(200).sendFile(__dirname + "/index.html");

    });
    
    app.post("/issues", function(req, res) {
        
        new Task(req.body).save().then(function(val) {
        
        }).catch(function(err) {
            console.error(err);
        });
        
        res.status(200).send("OK");
        
    }).get("/issues", function(req, res) {

        Task.find({}, function(err, tasks) {
            if (err) {
                console.error(err);
                res.status(500).send('err', err);
            }

            res.status(200).send(tasks);
        });
        
    }).put("/issues/:id", function(req, res) {

        var filter = {
            _id: req.params.id
        };
        
        Task.find(filter, function(err, tasks) {
            if (err) {
                console.error(err);
                res.send(err);
            } else {   
                tasks.forEach(function(task) {
                    task.open = false;
                    task.save().then(function(_) {
                        res.status(200).send("OK");
                        // what to do here?
                    }).catch(function(err) {
                        console.error(err);
                        res.status(500).send(err);
                    });
                });
            }
        });

    }).delete("/issues/:id", function(req, res) {

        var filter = {
            _id: req.params.id
        };
        
        Task.deleteOne(filter, function(err) {
            if (err) {
                console.error(err);
                res.status(500).send("error", err);
            }
        });

        res.status(200).send("OK");
    });

    var port = process.env.PORT || 3000;

    app.listen(port, function() {
        console.log("port", port);
    });

    
});