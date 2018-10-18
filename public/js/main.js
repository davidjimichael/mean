function fetchIssues() {
    $.get("/issues", function (issues) {
        var issuesList = document.getElementById("issuesList");
        
        issuesList.innerHTML = '';
        
        for (var i = 0; i < issues.length; i++) {
            var _issue = issues[i];
            var id = issues[i]._id;
            var desc = issues[i].description;
            var severity = issues[i].severity;
            var assignedTo = issues[i].assignedTo;
            var label = issues[i].open ? "Open" : "Closed";
            
            issuesList.innerHTML += '<div class="col-sm"><div class="well">' +
            '<h6>Issue ID: ' + id + '</h6>' +
            '<p><span id="' + id + '" class="label label-info">' + label + '</span></p>' +
            '<h3>' + desc + '</h3>' +
            '<p><span class="">Severity: </span> ' + severity + ' <br/> ' +
            '<span class="">Assigned:</span> ' + assignedTo + '</p>' +
            '<a href="#/" class="btn btn-warning" onclick="setStatusClosed(\'' + id + '\')">Close</a> ' +
            '<a href="#/" class="btn btn-danger" onclick="deleteIssue(\'' + id + '\')">Delete</a>' +
            '</div></div>';
        }
    });
}
    
function saveIssue(e) {
    var issue = {
        description: document.getElementById("issueDescInput").value,
        severity: document.getElementById("issueSeverityInput").value,
        assignedTo: document.getElementById("issueAssignedToInput").value,
        open: true,
    };
    
    $.post("/issues", issue, function(res) {
    });
    
    document.getElementById('issueInputForm').reset();

    e.preventDefault();

    fetchIssues();
}

document.getElementById('issueInputForm').addEventListener('submit', saveIssue);

function setStatusClosed(id) {
    $.ajax({
        url: "issues/" + id,
        type: "PUT",
        success: function (response) {
            fetchIssues();
            document.getElementById(String(id)).innerHTML = "Closed";
        }
    });
}

function deleteIssue(id) {
    $.ajax({
        url: "issues/" + id,
        type: "DELETE",
        success: function (response) {
            fetchIssues();
        }
    });
}

setInterval(function () {
    fetchIssues();
}, 10000); // 10 sec
