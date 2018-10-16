const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// mongodb://<dbuser>:<dbpassword>@ds045507.mlab.com:45507/mic
var uri = "mongodb://davidjimichael:Yell0w$tone@ds045507.mlab.com:45507/mic";
var options = {
    useNewUrlParser: true
};
mongoose.connect(uri, options);

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
    // connected!!
    /*
    data: {
            id: issueId,
            description: issueDesc,
            severity: issueSeverity,
            assignedTo: issueAssignedTo,
            status: issueStatus
        }
    */
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

        res.sendFile(__dirname + "/index.html");

    });
    
    app.post("/issues", function(req, res) {
        
        var task = new Task(req.body);
        console.debug("req.body", req.body);
        console.debug("task", task);
        task.save().then(function(val) {
            console.log(val);
        }).catch(function(err) {
            console.error(err);
        });
        
        res.sendStatus(200);
        
    }).get("/issues", function(req, res) {

        Task.find({}, function(error, tasks) {
            if (error) {
                console.error(error);
            }

            res.send(tasks);
        });
        
    }).put("/issues/:id", function(req, res) {

        var filter = {
            _id: req.params.id
        };
        
        Task.find(filter, function(error, tasks) {
            if (error) {
                console.error(error);
                res.sendStatus(500);
            }

            tasks.forEach(function(task) {
                if (task._id === req.params.id) {
                    task.open = false;
                    task.save();
                }
            });
        });

        res.sendStatus(200);
        
    }).delete("/issues/:id", function(req, res) {

        var filter = {
            _id: req.params.id
        };
        
        Task.deleteOne(filter, function(error) {
            if (error) {
                console.error(error);
                res.sendStatus(500);
            }
        });
        res.sendStatus(200);
    });

    app.listen(3000);
});