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
}

function Rule(rootMotion = 0, startingQuality = Quality.Major, endingQuality = Quality.Major) {
	this.rootMotion = rootMotion;
	this.startingQuality = startingQuality;
	this.endingQuality = endingQuality;
}

var testRules = [
	new Rule(7, Quality.Major, Quality.Major),
	new Rule(5, Quality.Major, Quality.Major),
];

function ChordGenerator() {
	var openDomain = [];
	for (var i = 0; i < 12; i++) {
		for (var j = 0; j < 4; j++) {
			openDomain.push({root: i, quality: j});
		}
	}
	//console.log(openDomain);
	var progression = [];
	var rules = [];

	this.generateProgressionOfLength = function(numberOfChords) {
		var cells = [];
		for (var i = 0; i < numberOfChords; i++) {
			cells.push(openDomain.slice());
		}

		runGenerator(cells);
	}

	this.generateProgressionFromTemplate = function(chordProgression) {
		var cells = [];
		for (var i = 0; i < chordProgression.length; i++) {
			if (chordProgression[i].root != undefined) {
				cells.push([chordProgression[i]]);
			} else {
				cells.push(openDomain.slice());
			}
		}

		runGenerator(cells);
	}

	this.SetRules = function(newRules)  {
		rules = newRules;
	}

	this.AddRule = function(newRule)  {
		rules.push(newRule);
	}

	function runGenerator(cells) {
		progression = cells.slice();

		while (!isCollapsed()) {
			iterate();
		}
	}

	function iterate() {
		var coordIndex = getMinEntripy();
		collaspeAt(coordIndex);
		propagate(coordIndex);
	}

	//Todo https://www.youtube.com/watch?v=2SuvO4Gi7uY 12:05
	function propagate(index) {

	}

	//Todo
	function collaspeAt(index) {

	}

	function isCollapsed() {
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

	//Todo
	function getMinEntripy() {
		return 0;
	}

}