const ghDataURL = "https://api.github.com/repos/rdyar/LabWOES/issues";

const ghData = [];

fetch(ghDataURL)
	.then(function (blob){ return blob.json()})
	.then(function (data) {ghData.push(...data)})
	.then(test);

function test() {
	for (var i=0, len = ghData.length; i < len; i++) {
	console.log(ghData[i].title);
	var ghi = document.querySelector('.gh-issues');
	var issue = document.createElement('p');
	issue.innerHTML = ghData[i].title;
	ghi.appendChild(issue);
  };
}
