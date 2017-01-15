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
	var issue = document.createElement('p');
	issue.innerHTML = data[i].title;
	ghi.appendChild(issue);
  };
}
