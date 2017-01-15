var xmlhttp = new XMLHttpRequest();
var url = "https://api.github.com/repos/rdyar/LabWOES/issues";

xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.responseText);
       listIssues(data);
    }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();

function listIssues(data) {
	for (var i=0, len = data.length; i < len; i++) {
	console.log(data[i].title);
	var ghi = document.querySelector('.gh-issues');
	var issue = document.createElement('div');
	    issue.className = "gh-issues-item";  
	var date = new Date(data[i].created_at);
	var ghidate = date.toDateString();
	issue.innerHTML = "<a href=" + data[i].html_url + ">" + data[i].title + "</a><br><span>Created on " + ghidate + "</span>";
	ghi.appendChild(issue);
  };
}