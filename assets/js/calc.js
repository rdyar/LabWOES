//inputs for paper
var paperWidth = document.querySelector('#paperWidth');
var paperLength = document.querySelector('#paperLength');
var paperCost = document.querySelector('#paperCost');
//inputs for chemicals
var devCostBox = document.querySelector('#devCostBox');
var devLitersBox = document.querySelector('#devLitersBox');
var devRepRate = document.querySelector('#devRepRate');

var blxCostBox = document.querySelector('#blxCostBox');
var blxLitersBox = document.querySelector('#blxLitersBox');
var blxRepRate = document.querySelector('#blxRepRate');

var stabCostBox = document.querySelector('#stabCostBox');
var stabLitersBox = document.querySelector('#stabLitersBox');
var stabRepRate = document.querySelector('#stabRepRate');

//used to display sqf and sqi
var displaySqf = document.querySelector('#sfpr');
var displaySqi = document.querySelector('#sipr');

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

 var chemCostPerInch;
 var devCostPerInch;
 var blxCostPerInch;
 var stabCostPerInch;

function chemPrices (id, multiplier) {
	var cell = '#' + id;
	
	var chem = document.querySelector(cell);
		chem.textContent = rounder((chemCostPerInch * multiplier),4);
		chem
			.appendChild(document.createElement("span"))
			.className = "chem-prices";
		chem.querySelector('.chem-prices').innerHTML = "Developer: " + rounder((devCostPerInch*multiplier),4) +"<br>Bleach Fix: " + rounder((blxCostPerInch*multiplier),4) + "<br>Stabilizer: " + rounder((stabCostPerInch*multiplier),4);
}

function update (){

	paperCostPerInch = calcPaperCostPerInch();	
    devCostPerInch = calcChemCostPerInch(devCostBox.value,devLitersBox.value,devRepRate.value);
    blxCostPerInch = calcChemCostPerInch(blxCostBox.value,blxLitersBox.value,blxRepRate.value);
    stabCostPerInch = calcChemCostPerInch(stabCostBox.value,stabLitersBox.value,stabRepRate.value);
    chemCostPerInch = (devCostPerInch+blxCostPerInch+stabCostPerInch);
	
		// paper costs
		document.querySelector('#costPIpaper').textContent = paperCostPerInch;
		document.querySelector('#costPFpaper').textContent = rounder((paperCostPerInch* 144),4)
		document.querySelector('#cost4x6paper').textContent = rounder(paperCostPerInch* 24,4)
		document.querySelector('#cost5x7paper').textContent = rounder(paperCostPerInch* 35,4)
		document.querySelector('#cost8x10paper').textContent = rounder(paperCostPerInch* 80,4)
		document.querySelector('#cost11x14paper').textContent = rounder(paperCostPerInch* 151,4)
		document.querySelector('#cost16x20paper').textContent = rounder(paperCostPerInch* 320,4)
		document.querySelector('#cost10kpaper').textContent = rounder(paperCostPerInch* 240000,4)
		//chem costs
		
		chemPrices('costPIchemicals',1);
		chemPrices('costPFchemicals',144);
		chemPrices('cost4x6chemicals',24);
		chemPrices('cost5x7chemicals',35);
		chemPrices('cost8x10chemicals',80);
		chemPrices('cost11x14chemicals',151);
		chemPrices('cost16x20chemicals',320);
		chemPrices('cost10kchemicals',240000);
		// var chemPI = document.querySelector('#costPIchemicals');
		// chemPI.textContent = rounder(chemCostPerInch,4);
		// chemPI
		// 	.appendChild(document.createElement("span"))
		// 	.className = "chem-prices";
		// chemPI.querySelector('.chem-prices').innerHTML = "Developer: " + rounder(devCostPerInch,4) +"<br>Bleach Fix: " + rounder(blxCostPerInch,4) + "<br>Stabilizer: " + rounder(stabCostPerInch,4);


		//document.querySelector('#costPFchemicals').textContent =  rounder(chemCostPerInch * 144,4);
		// document.querySelector('#cost4x6chemicals').textContent =  rounder(chemCostPerInch * 24,4);
		// document.querySelector('#cost5x7chemicals').textContent =  rounder(chemCostPerInch * 35,4);
		// document.querySelector('#cost8x10chemicals').textContent =  rounder(chemCostPerInch * 80,4);
		// document.querySelector('#cost11x14chemicals').textContent =  rounder(chemCostPerInch * 151,4);
		// document.querySelector('#cost16x20chemicals').textContent =  rounder(chemCostPerInch * 320,4);
		// document.querySelector('#cost10kchemicals').textContent =  rounder(chemCostPerInch * 240000,4);
		//total costs
		var totalPerInch = paperCostPerInch + chemCostPerInch;
		document.querySelector('#totalPI').textContent = rounder(totalPerInch,4);
		document.querySelector('#totalPF').textContent = rounder((totalPerInch*144),3);
		document.querySelector('#total4x6').textContent = rounder((totalPerInch*24),3);
		document.querySelector('#total5x7').textContent = rounder((totalPerInch*35),3);
		document.querySelector('#total8x10').textContent = rounder((totalPerInch*80),3);
		document.querySelector('#total11x14').textContent = rounder((totalPerInch*151),3);
		document.querySelector('#total16x20').textContent = rounder((totalPerInch*320),3);
		document.querySelector('#total10k').textContent = rounder((totalPerInch*240000),3);

		console.groupCollapsed("results")
		console.log("Paper Cost per Square Inch: ",paperCostPerInch);
		console.log("Paper Cost per 8x10: ",(paperCostPerInch*80));		
		console.log("Developer Cost per 8x10: ",(devCostPerInch*80));
		console.log("Bleach Fix Cost per 8x10: ",(blxCostPerInch*80));
		console.log("Stabilizer Cost per 8x10: ",(stabCostPerInch*80));
		console.log("Total Cost per 8x10: ",(rounder((totalPerInch*80),4)));
		console.groupEnd()
	}

	function calcSqi () {
		var totalSqf = paperWidth.value/12 *paperLength.value;
		var paperSqi = totalSqf*144
		displaySqf.textContent = Number((totalSqf).toFixed(2));
		displaySqi.textContent = paperSqi;
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
	    return rounded = Number((num).toFixed(limit));
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
	displayLiters.textContent = rounder(liters,2);
}

var mlm = document.querySelector('#mlm');
mlm.addEventListener('change', mlm2mft);

function mlm2mft (){
	var mft = this.value / 10.7639;

	var displaymft = document.querySelector('#mft');
	displaymft.textContent = rounder(mft,2);
}