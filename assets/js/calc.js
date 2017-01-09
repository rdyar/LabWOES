var paperWidth = document.querySelector('#paperWidth');
var paperLength = document.querySelector('#paperLength');
var paperCost = document.querySelector('#paperCost');
//chemicals
var devCostBox = document.querySelector('#devCostBox');
var devLitersBox = document.querySelector('#devLitersBox');
var devRepRate = document.querySelector('#devRepRate');

var blxCostBox = document.querySelector('#blxCostBox');
var blxLitersBox = document.querySelector('#blxLitersBox');
var blxRepRate = document.querySelector('#blxRepRate');

var stabCostBox = document.querySelector('#stabCostBox');
var stabLitersBox = document.querySelector('#stabLitersBox');
var stabRepRate = document.querySelector('#stabRepRate');

var totalPI = document.querySelector('#totalPI');
var totalPF = document.querySelector('#totalPF');
var total4x6 = document.querySelector('#total4x6');
var total5x7 = document.querySelector('#total5x7');
var total8x10 = document.querySelector('#total8x10');
var total11x14 = document.querySelector('#total11x14');
var total16x20 = document.querySelector('#total16x20');
var total10k = document.querySelector('#total10k');

var displaySqf = document.querySelector('#sfpr');
var displaySqi = document.querySelector('#sipr');

//used to display costs
var costPIpaper = document.querySelector('#costPIpaper');
var cost4x6paper = document.querySelector('#cost4x6paper');
var cost5x7paper = document.querySelector('#cost5x7paper');
var cost8x10paper = document.querySelector('#cost8x10paper');
var cost11x14paper = document.querySelector('#cost11x14paper');
var cost16x20paper = document.querySelector('#cost16x20paper');
var cost10kpaper = document.querySelector('#cost10kpaper');

var costPIchemicals = document.querySelector('#costPIchemicals');
var costPItotal = document.querySelector('#costPItotal');

//get all input text boxes and add an event listener to each one to trigger the update function
inputTextBoxes = document.getElementById("inputs").querySelectorAll('input[type="number"]')
Array.from(inputTextBoxes).forEach(function(element) {
	element.addEventListener('change', update);
});
//if enter is pressed send to tab function to remove focus
allTextBoxes = document.querySelectorAll('input[type="number"]')
Array.from(allTextBoxes).forEach(function(element) {
	element.onkeypress = tab;
});

function update (){

	var devCostPerInch = calcChemCostPerInch(devCostBox.value,devLitersBox.value,devRepRate.value);
	var blxCostPerInch = calcChemCostPerInch(blxCostBox.value,blxLitersBox.value,blxRepRate.value);
	var stabCostPerInch = calcChemCostPerInch(stabCostBox.value,stabLitersBox.value,stabRepRate.value);
	
	var paperCostPerInch = calcPaperCostPerInch();
	var chemCostPerInch = (devCostPerInch+blxCostPerInch+stabCostPerInch);
		// paper costs
		costPIpaper.innerHTML = paperCostPerInch;
		costPFpaper.innerHTML = rounder((paperCostPerInch* 144),4)
		cost4x6paper.innerHTML = rounder(paperCostPerInch* 24,4)
		cost5x7paper.innerHTML = rounder(paperCostPerInch* 35,4)
		cost8x10paper.innerHTML = rounder(paperCostPerInch* 80,4)
		cost11x14paper.innerHTML = rounder(paperCostPerInch* 151,4)
		cost16x20paper.innerHTML = rounder(paperCostPerInch* 320,4)
		cost10kpaper.innerHTML = rounder(paperCostPerInch* 240000,4)
		//chem costs
		costPIchemicals.innerHTML = rounder(chemCostPerInch,4);
		costPFchemicals.innerHTML =  rounder(chemCostPerInch * 144,4);
		cost4x6chemicals.innerHTML =  rounder(chemCostPerInch * 24,4);
		cost5x7chemicals.innerHTML =  rounder(chemCostPerInch * 35,4);
		cost8x10chemicals.innerHTML =  rounder(chemCostPerInch * 80,4);
		cost11x14chemicals.innerHTML =  rounder(chemCostPerInch * 151,4);
		cost16x20chemicals.innerHTML =  rounder(chemCostPerInch * 320,4);
		cost10kchemicals.innerHTML =  rounder(chemCostPerInch * 240000,4);
		//total costs
		var totalPerInch = paperCostPerInch + chemCostPerInch;
		totalPI.innerHTML = rounder(totalPerInch,4);
		totalPF.innerHTML = rounder((totalPerInch*144),3);
		total4x6.innerHTML = rounder((totalPerInch*24),3);
		total5x7.innerHTML = rounder((totalPerInch*35),3);
		total8x10.innerHTML = rounder((totalPerInch*80),3);
		total11x14.innerHTML = rounder((totalPerInch*151),3);
		total16x20.innerHTML = rounder((totalPerInch*320),3);
		total10k.innerHTML = rounder((totalPerInch*240000),3);

		console.groupCollapsed("results")
		console.log("Paper Cost per Square Inch: ",paperCostPerInch);
		console.log("Paper Cost per 8x10: ",(paperCostPerInch*80));		
		console.log("Developer Cost per 8x10: ",(devCostPerInch*80);
		console.log("Bleach Fix Cost per 8x10: ",(blxCostPerInch*80));
		console.log("Stabilizer Cost per 8x10: ",(stabCostPerInch*80));
		console.log("Total Cost per 8x10: ",(rounder((totalPerInch*80),4)));
		console.groupEnd()
	}

	function calcSqi () {
		var totalSqf = paperWidth.value/12 *paperLength.value;
		var paperSqi = totalSqf*144
		displaySqf.innerHTML = Number((totalSqf).toFixed(2));
		displaySqi.innerHTML = paperSqi;
		return paperSqi;
	}

	function calcPaperCostPerInch() {
		var costPsqi =  Number((paperCost.value / calcSqi()).toFixed(5)); 
		return Number.isFinite(costPsqi) ? costPsqi : 0;

	}

	function calcChemCostPerInch(cost,liters,repRate){
		var costPerInch = (cost/((liters/repRate)*1000))/144;
		return Number.isFinite(costPerInch) ? costPerInch : 0;
	}

	function rounder (num, limit){
		var rounded = Number((num).toFixed(limit));
		return rounded;
	}

//if enter is pressed remove focus
function tab(e) {
	if (e.which == 13) {
		e.target.blur();
	}
}

// conversions
var gallons = document.querySelector('#gallons');
gallons.addEventListener('change', gallons2liters);

function gallons2liters (){
	var liters = this.value * 3.785;
	var displayLiters = document.querySelector('#liters');
	displayLiters.innerHTML = rounder(liters,2);
}

var mlm = document.querySelector('#mlm');
mlm.addEventListener('change', mlm2mft);

function mlm2mft (){
	var mft = this.value / 10.7639;

	var displaymft = document.querySelector('#mft');
	displaymft.innerHTML = rounder(mft,2);
}