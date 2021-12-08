const Quality = {
	Major: 0,
	Minor: 1,
	Diminished: 2,
	Augmented: 3
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

function Chord(root = 0, quality = Quality.Major) {
	this.root = (root < 0 ? root + 12 : root) % 12;
	this.quality = quality;

	this.getBitmask = function() {
		this.root = (this.root < 0 ? this.root + 12 : this.root) % 12;
		var chordMask = "1";

		//Fill mask with quality
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

		//Rorate mask to root
		const rotate = chordMask.length - (this.root % chordMask.length);
		chordMask = chordMask.slice(rotate) + chordMask.slice(0, rotate);

		return chordMask;
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
	new Rule(2, Quality.Major, Quality.Major),
	new Rule(-2, Quality.Major, Quality.Major),
	new Rule(2, Quality.Major, Quality.Minor),
	new Rule(-2, Quality.Minor, Quality.Major),
	new Rule(-3, Quality.Major, Quality.Minor),
	new Rule(3, Quality.Minor, Quality.Major),
	new Rule(0, Quality.Major, Quality.Minor),
	new Rule(0, Quality.Minor, Quality.Major),
	new Rule(0, Quality.Major, Quality.Augmented),
	new Rule(0, Quality.Augmented, Quality.Major),
	new Rule(0, Quality.Minor, Quality.Diminished),
	new Rule(0, Quality.Diminished, Quality.Minor),
	new Rule(0, Quality.Minor, Quality.Augmented),
	new Rule(0, Quality.Augmented, Quality.Minor),
	new Rule(0, Quality.Major, Quality.Diminished),
	new Rule(0, Quality.Diminished, Quality.Major),
	new Rule(1, Quality.Diminished, Quality.Major),
	new Rule(1, Quality.Diminished, Quality.Minor),
	new Rule(4, Quality.Major, Quality.Diminished),
];

function ChordGenerator() {
	var openDomain = [];
	for (var i = 0; i < 12; i++) {
		for (var j = 0; j < 4; j++) {
			openDomain.push(new Chord(i, j));
		}
	}
	//console.log(openDomain);
	var loopProgression = false;
	var progression = [];
	var rules = testRules;

	var failsafeRules = [
		new Rule(0, Quality.Major, Quality.Major),
		new Rule(0, Quality.Minor, Quality.Minor),
		new Rule(0, Quality.Diminished, Quality.Diminished),
		new Rule(0, Quality.Augmented, Quality.Augmented),
	]

	this.generateProgressionOfLength = function(numberOfChords, loop = false) {
		var passCell = [];
		for (var i = 0; i < numberOfChords; i++) {
			passCell.push(0);
		}

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

	this.SetRules = function(newRules)  {
		rules = newRules;
	}

	this.AddRule = function(newRule)  {
		rules.push(newRule);
	}

	this.AddRules = function(newRules)  {
		for (var i = 0; i < newRules.length; i++) {
			rules.push(newRules[i]);
		}
	}

	function AddRules(newRules)  {
		for (var i = 0; i < newRules.length; i++) {
			rules.push(newRules[i]);
		}
	}

	function runGenerator(cells, itaration = 5) {
		console.log("runGenerator " + itaration);
		if (itaration == 1) AddRules(failsafeRules);
		if (itaration <= 0) return;

		progression = JSON.parse(JSON.stringify(cells));
		console.log(JSON.parse(JSON.stringify(progression)));
		for (var i = 0; i < progression.length; i++) {
			propagate(i);
		}
		console.log(JSON.parse(JSON.stringify(progression)));
		while (!isCollapsed()) {
			iterate();
		}
		if (isBroken()) runGenerator(cells, itaration-1);
	}

	function iterate() {
		//console.log("iterate");
		var coordIndex = getMinEntripy();
		collaspeAt(coordIndex);
		console.log(JSON.parse(JSON.stringify(progression)));
		propagate(coordIndex);
	}

	//Todo
	function propagate(index) {
		var stack = [];
		stack.push(index);

		while (stack.length > 0) {
			//console.log(stack);
			var currentIndex = stack.pop();
			//console.log("propagate " + index + " " + currentIndex);

			//Forward
			if (currentIndex+1 < progression.length) { //no loop
				//if (progression[currentIndex+1].length <= 1) continue;
				var changed = false;

				//Loop over first chord
				for (var i = progression[currentIndex+1].length-1; i >= 0; i--) {
					var matches = 0;
					//Loop over second chord
					for (var j = progression[currentIndex].length-1; j >= 0; j--) {
						//Loop over rules
						for (var r = 0; r < rules.length; r++) {
							if (rulePossible(progression[currentIndex][j], progression[currentIndex+1][i], rules[r])) {
								matches++;
							}
						}
					}
					if (matches <= 0) {
						//console.log("Cutting " + progression[currentIndex+1][i].root + ":" + progression[currentIndex+1][i].quality + " at " + matches + " matches");
						progression[currentIndex+1].splice(i, 1);
						changed = true;
					} else {
						//console.log("Keeping " + progression[currentIndex+1][i].root + ":" + progression[currentIndex+1][i].quality + " at " + matches + " matches");
					}
				}
				if (changed) {
					stack.push(currentIndex+1);
				}
			}

			//Backward
			if (currentIndex-1 >= 0) { //no loop
				//if (progression[currentIndex-1].length <= 1) continue;
				var changed = false;

				//Loop over first chord
				for (var i = progression[currentIndex-1].length-1; i >= 0; i--) {
					var matches = 0;
					//Loop over second chord
					for (var j = progression[currentIndex].length-1; j >= 0; j--) {
						//Loop over rules
						for (var r = 0; r < rules.length; r++) {
							if (rulePossible(progression[currentIndex-1][i], progression[currentIndex][j], rules[r])) {
								matches++;
							}
						}
					}
					if (matches <= 0) {
						//console.log("Cutting " + progression[currentIndex-1][i].root + ":" + progression[currentIndex-1][i].quality + " at " + matches + " matches");
						progression[currentIndex-1].splice(i, 1);
						changed = true;
					} else {
						//console.log("Keeping " + progression[currentIndex-1][i].root + ":" + progression[currentIndex-1][i].quality + " at " + matches + " matches");
					}
				}
				if (changed) {
					stack.push(currentIndex-1);
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

		console.log(minis);
		return minis[Math.floor(Math.random() * minis.length)];
	}

}