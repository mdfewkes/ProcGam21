const Quality = {
	Major: 0,
	Minor: 1,
	Diminished: 2,
	Augmented: 3
}

const QualityDecode = {
	0: "Major",
	1: "Minor",
	2: "Diminished",
	3: "Augmented"
}

const NoteName = {
	"Cb": 11,
	"C": 0,
	"C#": 1,
	"Db": 1,
	"D": 2,
	"D#": 3,
	"Eb": 3,
	"E": 4,
	"E#": 5,
	"Fb": 4,
	"F": 5,
	"F#": 6,
	"Gb": 6,
	"G": 7,
	"G#": 8,
	"Ab": 8,
	"A": 9,
	"A#": 10,
	"Bb": 10,
	"B": 11,
	"B#": 0
}

const NoteNumber = {
	0: "C",
	1: "C#",
	2: "D",
	3: "D#",
	4: "E",
	5: "F",
	6: "F#",
	7: "G",
	8: "G#",
	9: "A",
	10: "A#",
	11: "B"
}

function Chord(root = 0, quality = Quality.Major) {
	this.root = (root < 0 ? root + 12 : root) % 12;
	this.quality = quality;

	this.getChroma = function() {
		this.root = (this.root < 0 ? this.root + 12 : this.root) % 12;
		var chordMask = "1";

		switch (quality) {
			case Quality.Major:
				chordMask = "10001001";
				break;
			case Quality.Minor:
				chordMask = "10010001";
				break;
			case Quality.Diminished:
				chordMask = "1001001";
				break;
			case Quality.Augmented:
				chordMask = "100010001";
				break;
		}
		chordMask = chordMask.padEnd(12, "0");

		return chordMask;
	}

	this.getChordMask = function() {
		this.root = (this.root < 0 ? this.root + 12 : this.root) % 12;
		var chordMask = this.getChroma();

		const rotate = chordMask.length - (this.root % chordMask.length);
		chordMask = chordMask.slice(rotate) + chordMask.slice(0, rotate);

		return chordMask;
	}

	this.getSymbol = function() {
		this.root = (this.root < 0 ? this.root + 12 : this.root) % 12;
		var symbol = NoteNumber[this.root];

		switch (quality) {
			case Quality.Major:
				symbol += "";
				break;
			case Quality.Minor:
				symbol += "m";
				break;
			case Quality.Diminished:
				symbol += "°";
				break;
			case Quality.Augmented:
				symbol += "+";
				break;
		}

		return symbol;
	}
}

function Rule(rootMotion = 0, startingQuality = Quality.Major, endingQuality = Quality.Major) {
	this.rootMotion = (rootMotion < 0 ? rootMotion + 12 : rootMotion) % 12;
	this.startingQuality = startingQuality;
	this.endingQuality = endingQuality;
}

//I V vi iii IV I IV V
var testRules5 = [
	new Rule(7, Quality.Major, Quality.Major),
	new Rule(2, Quality.Major, Quality.Minor),
	new Rule(7, Quality.Minor, Quality.Minor),
	new Rule(1, Quality.Minor, Quality.Major),
	new Rule(-5, Quality.Major, Quality.Major),
	new Rule(5, Quality.Major, Quality.Major),
	new Rule(2, Quality.Major, Quality.Major),
	new Rule(-7, Quality.Major, Quality.Major),
];

//I vi IV V
var testRules4 = [
	new Rule(-3, Quality.Major, Quality.Minor),
	new Rule(-4, Quality.Minor, Quality.Major),
	new Rule(2, Quality.Major, Quality.Major),
	new Rule(-5, Quality.Major, Quality.Major),
];

//I IV V IV
var testRules3 = [
	new Rule(5, Quality.Major, Quality.Major),
	new Rule(2, Quality.Major, Quality.Major),
	new Rule(-2, Quality.Major, Quality.Major),
	new Rule(-5, Quality.Major, Quality.Major),
];

//I V vi IV
var testRules2 = [
	new Rule(7, Quality.Major, Quality.Major),
	new Rule(2, Quality.Major, Quality.Minor),
	new Rule(-4, Quality.Minor, Quality.Major),
	new Rule(-5, Quality.Major, Quality.Major),
];

//I IV V I
var testRules1 = [
	new Rule(5, Quality.Major, Quality.Major),
	new Rule(2, Quality.Major, Quality.Major),
];

var testRules = [
	new Rule(7, Quality.Major, Quality.Major),
	new Rule(-7, Quality.Major, Quality.Major),
	new Rule(7, Quality.Minor, Quality.Minor),
	new Rule(-7, Quality.Minor, Quality.Minor),
	new Rule(-7, Quality.Major, Quality.Minor),
	new Rule(2, Quality.Major, Quality.Major),
	new Rule(-2, Quality.Major, Quality.Major),
	new Rule(2, Quality.Minor, Quality.Minor),
	new Rule(-2, Quality.Minor, Quality.Minor),
	new Rule(2, Quality.Major, Quality.Minor),
	new Rule(-2, Quality.Minor, Quality.Major),
	new Rule(-3, Quality.Major, Quality.Minor),
	new Rule(3, Quality.Minor, Quality.Major),
	new Rule(0, Quality.Major, Quality.Minor),
	//new Rule(0, Quality.Minor, Quality.Major),
	new Rule(0, Quality.Major, Quality.Augmented),
	//new Rule(0, Quality.Augmented, Quality.Major),
	new Rule(0, Quality.Minor, Quality.Diminished),
	//new Rule(0, Quality.Diminished, Quality.Minor),
	//new Rule(0, Quality.Minor, Quality.Augmented),
	//new Rule(0, Quality.Augmented, Quality.Minor),
	new Rule(0, Quality.Major, Quality.Diminished),
	//new Rule(0, Quality.Diminished, Quality.Major),
	new Rule(1, Quality.Diminished, Quality.Major),
	//new Rule(1, Quality.Diminished, Quality.Minor),
	new Rule(4, Quality.Major, Quality.Diminished),
	new Rule(6, Quality.Major, Quality.Diminished),
	new Rule(5, Quality.Augmented, Quality.Major),
];

function ChordGenerator() {
	var openDomain = [];
	for (var i = 0; i < 12; i++) {
		for (var j = 0; j < 4; j++) {
			openDomain.push(new Chord(i, Quality[QualityDecode[j]]));
		}
	}
	//console.log(openDomain);
	var loopProgression = false;
	var forgivingOutput = false;
	var progression = [];
	var rules = testRules;

	var failsafeRules = [
		new Rule(0, Quality.Major, Quality.Major),
		new Rule(0, Quality.Minor, Quality.Minor),
		new Rule(0, Quality.Diminished, Quality.Diminished),
		new Rule(0, Quality.Augmented, Quality.Augmented),
	]

	this.generateProgressionOfLength = function(numberOfChords, loop = false, firstChord = 0, lastChord = 0) {
		var passCell = [];
		for (var i = 0; i < numberOfChords; i++) {
			if (i == 0) {
				passCell.push(firstChord);
			} else if (i == numberOfChords - 1) {
				passCell.push(lastChord);
			} else {
				passCell.push(0);
			}
		}
		//console.log("generateProgressionOfLength");
		//console.log(passCell);

		return this.generateProgressionFromTemplate(passCell, loop);
	}

	this.generateProgressionFromTemplate = function(chordProgression, loop = false) {
		loopProgression = loop;

		var cells = [];
		for (var i = 0; i < chordProgression.length; i++) {
			if (chordProgression[i].root != undefined && chordProgression[i].quality != undefined) {
				cells.push([chordProgression[i]]);
			} else if (chordProgression[i].length != undefined) {
				cells.push(chordProgression[i]);
			} else {
				cells.push(JSON.parse(JSON.stringify(openDomain)));
			}
		}
		//console.log("generateProgressionFromTemplate");
		//console.log(cells);

		runGenerator(cells);
		renderProgression();
		return progression;
	}

	this.setRules = function(newRules)  {
		rules = newRules;
	}

	this.addRule = function(newRule)  {
		rules.push(newRule);
	}

	this.addRules = function(newRules)  {
		for (var i = 0; i < newRules.length; i++) {
			rules.push(newRules[i]);
		}
	}

	this.setScaleMask = function(scaleMask, divergence = 0) {
		openDomain = [];
		for (var i = 0; i < 12; i++) {
			for (var j = 0; j < 4; j++) {
				openDomain.push(new Chord(i, Quality[QualityDecode[j]]));
			}
		}

		for (var i = openDomain.length-1; i >= 0; i--) {
			//console.log(openDomain[i].getSymbol() + " " + bitwiseAnd(openDomain[i].getChordMask(),scaleMask) + " " + openDomain[i].getChordMask() + " " + scaleMask);

			var testMask = bitwiseAnd(openDomain[i].getChordMask(),scaleMask);
			var difference = 3;
			for (var j = 0; j < testMask.length; j++) {
				if (testMask[j] == "1") difference--;
				//console.log(testMask[j]);
			}
			//console.log(difference);
			if (difference > divergence) {
				openDomain.splice(i, 1);
			}
		}
		//console.log(JSON.parse(JSON.stringify(openDomain)));
	}

	this.setChroma = function(chroma, root = 0, divergence = 0) {
		var scaleMask = chroma;

		const rotate = scaleMask.length - (root % scaleMask.length);
		scaleMask = scaleMask.slice(rotate) + scaleMask.slice(0, rotate);

		this.setScaleMask(scaleMask, divergence);
	}

	function addRules(newRules)  {
		for (var i = 0; i < newRules.length; i++) {
			rules.push(newRules[i]);
		}
	}

	function runGenerator(cells) {
		//console.log("runGenerator");


		progression = JSON.parse(JSON.stringify(cells));
		for (var i = 0; i < progression.length; i++) {
			propagate(i);
		}
		if (isBroken()) {
			console.log("Output gridlocked, trying failsafe")
			addRules(failsafeRules);
			progression = JSON.parse(JSON.stringify(cells));
			for (var i = 0; i < progression.length; i++) {
				propagate(i);
			}
		}
		if (isBroken()) {
			console.log("Output still gridlocked, loosening restrictions")
			forgivingOutput = true;
			progression = JSON.parse(JSON.stringify(cells));
			for (var i = 0; i < progression.length; i++) {
				propagate(i);
			}
		}


		//console.log(JSON.parse(JSON.stringify(progression)));
		while (!isCollapsed()) {
			iterate();
		}

		forgivingOutput = false;
	}

	function iterate() {
		//console.log("iterate");
		var coordIndex = getMinEntripy();
		collaspeAt(coordIndex);
		//console.log(JSON.parse(JSON.stringify(progression)));
		propagate(coordIndex);
	}

	function propagate(index) {
		var stack = [];
		stack.push(index);

		while (stack.length > 0) {
			//console.log(stack);
			var currentIndex = stack.pop();
			//console.log("propagate " + index + " " + currentIndex);

			//Forward
			var forwardIndex = currentIndex + 1;
			if (loopProgression) forwardIndex = forwardIndex % progression.length;
			if (forwardIndex < progression.length) { //no loop
				if (forgivingOutput && progression[currentIndex+1].length <= 1) continue;
				var changed = false;

				//Loop over second chord
				for (var i = progression[forwardIndex].length-1; i >= 0; i--) {
					var matches = 0;
					//Loop over first chord
					for (var j = progression[currentIndex].length-1; j >= 0; j--) {
						//Loop over rules
						for (var r = 0; r < rules.length; r++) {
							if (rulePossible(progression[currentIndex][j], progression[forwardIndex][i], rules[r])) {
								matches++;
							}
						}
					}
					if (matches <= 0) {//console.log("Cutting " + progression[currentIndex+1][i].root + ":" + progression[currentIndex+1][i].quality + " at " + matches + " matches");
						progression[forwardIndex].splice(i, 1);
						changed = true;
					}
				}
				if (changed) {
					stack.push(forwardIndex);
				}
			}

			//Backward
			var backwardIndex = currentIndex - 1;
			if (loopProgression && currentIndex-1 < 0) backwardIndex = progression.length - 1;
			if (backwardIndex >= 0) { //no loop
				if (forgivingOutput && progression[currentIndex-1].length <= 1) continue;
				var changed = false;

				//Loop over first chord
				for (var i = progression[backwardIndex].length-1; i >= 0; i--) {
					var matches = 0;
					//Loop over second chord
					for (var j = progression[currentIndex].length-1; j >= 0; j--) {
						//Loop over rules
						for (var r = 0; r < rules.length; r++) {
							if (rulePossible(progression[backwardIndex][i], progression[currentIndex][j], rules[r])) {
								matches++;
							}
						}
					}
					if (matches <= 0) {
						progression[backwardIndex].splice(i, 1);
						changed = true;
					}
				}
				if (changed) {
					stack.push(backwardIndex);
				}
			}


			//console.log(JSON.parse(JSON.stringify(progression)));

		}
	}

	function renderProgression() {
		for (var i = 0; i < progression.length; i++) {
			progression[i] = progression[i][Math.floor(Math.random() * progression[i].length)];
		}
	}

	function rulePossible(chord1, chord2, rule) {
		var newRoot = (chord1.root + rule.rootMotion < 0 ? chord1.root + rule.rootMotion + 12 : chord1.root + rule.rootMotion) % 12;
		//console.log(chord1.root + ":" + chord1.quality + " " + chord2.root + ":" + chord2.quality + " " + rule.startingQuality + ":" + rule.endingQuality + ":" + rule.rootMotion)
		return (chord1.quality == rule.startingQuality) 
		  && (chord2.quality == rule.endingQuality) 
		  && (newRoot == chord2.root);
	}

	function collaspeAt(index) {
		//console.log(index);
		progression[index] = [progression[index][Math.floor(Math.random() * progression[index].length)]];
	}

	function isCollapsedAt(index) {
		if (progression[index].length > 1) return false;
		else return true;
	}

	function isCollapsed() {
		//console.log("Testing collapse")
		for (var i = 0; i < progression.length; i++) {
			if (progression[i].length > 1) return false;
		}
		return true;
	}

	function isBroken() {
		for (var i = 0; i < progression.length; i++) {
			if (progression[i].length == 0) return true;
		}
		return false;
	}

	function getMinEntripy() {
		var minis = [0];
		var miniEnt = 10000000;

		for (var i = 0; i < progression.length; i++) {
			if (progression[i].length == miniEnt) {
				minis.push(i);
			} else if (progression[i].length < miniEnt && progression[i].length > 1) {
				miniEnt = progression[i].length;
				minis = [];
				minis.push(i);
			}
		}

		//console.log(minis);
		return minis[Math.floor(Math.random() * minis.length)];
	}

}

bitwiseAnd = function(s1, s2) {
		 
	let length = 0;

	let len_a = s1.length;
	let len_b = s2.length;

	let num_zeros = Math.abs(len_a - len_b);

	if (len_a < len_b) {
		for(let i = 0; i < num_zeros; i++) {
			s1 = '0' + s1;
		}
	 
		length = len_b;
	} else {
		for (let i = 0; i < num_zeros; i++) {
			s2 = '0' + s2;
		}
		length = len_a;
	}
 


 
	let res = "";
 
	for(let i = 0 ; i<length; i++) {
		res = res + String.fromCharCode((s1[i].charCodeAt() -
										   '0'.charCodeAt() &
										 s2[i].charCodeAt() -
										   '0'.charCodeAt()) +
										   '0'.charCodeAt());
	}
	
	return res;

}
