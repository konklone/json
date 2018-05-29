#!/usr/bin/env node

var input;

function usage ( ) {
	console.log('usage: ', process.argv.slice(0, 2), 'inputfile.json');
}

if (!module.parent) {

  var jsdom = require("jsdom").jsdom;
  global.window = jsdom().defaultView;
  global.jQuery = global.$ = require("jquery");

  require('./assets/jquery-2.1.1.min.js');
  require('./assets/jquery.csv.js');
  require('./assets/site.js');
  var inputFileName = process.argv.slice(2, 3).pop();

  if ([null, '--help', '-h', 'help'].indexOf(inputFileName) > 0) {
    usage( );
    process.exit(0)
  }
  if (!inputFileName) {
    usage( )
    process.exit(1);
  }

  var fs = require('fs');
  var cwd = process.cwd()
  try {
    var inputData = JSON.parse(fs.readFileSync(inputFileName, 'utf8'));
  } catch (e) {
    return console.error("Could not parse input file: ", e);
  }

  //console.error(JSON.stringify(inputData));
  //console.error("About to convert",inputData.length,"records to CSV");
  doCSV(inputData);
} 

function doJSON() {
	// just in case
	$(".drop").hide();

	// get input JSON, try to parse it
	var newInput = $(".json textarea").val();
	if (newInput == input) return;

	input = newInput;
	if (!input) {
		// wipe the rendered version too
		$(".json code").html("");
		return;
	}

	var json = jsonFrom(input);

	// if succeeded, prettify and highlight it
	// highlight shows when textarea loses focus
	if (json) {
		// Reset any error message from previous failed parses.
		$("div.error").hide();
		$("div.warning").show();

		var pretty = JSON.stringify(json, undefined, 2);
		$(".json code").html(pretty);
		if (pretty.length < (50 * 1024))
			hljs.highlightBlock($(".json code").get(0));

		// convert to CSV, make available
		doCSV(json);
	} else {
		// Show error.
		$("div.warning").hide();
		$("div.error").show();
		$(".json code").html("");
	}

	// Either way, update the error-reporting link to include the latest.
	setErrorReporting(null, input);

	return true;
}


function showCSV(rendered) {
	if (rendered) {
		if ($(".csv table").html()) {
			$(".csv .rendered").show();
			$(".csv .editing").hide();
		}
	} else {
		$(".csv .rendered").hide();
		$(".csv .editing").show().focus();
	}
}

// takes an array of flat JSON objects, converts them to arrays
// renders them into a small table as an example
function renderCSV(objects) {
	var rows = $.csv.fromObjects(objects, {justArrays: true});
	if (rows.length < 1) return;

	// find CSV table
	var table = $(".csv table")[0];
	$(table).html("");

	// render header row
	var thead = document.createElement("thead");
	var tr = document.createElement("tr");
	var header = rows[0];
	for (field in header) {
		var th = document.createElement("th");
		$(th).html(header[field])
		tr.appendChild(th);
	}
	thead.appendChild(tr);

	// render body of table
	var tbody = document.createElement("tbody");
	for (var i=1; i<rows.length; i++) {
		tr = document.createElement("tr");
		for (field in rows[i]) {
			var td = document.createElement("td");
			$(td)
				.html(rows[i][field])
				.attr("title", rows[i][field]);
			tr.appendChild(td);
		}
		tbody.appendChild(tr);
	}

	table.appendChild(thead);
	table.appendChild(tbody);
}

function doCSV(json) {
	// 1) find the primary array to iterate over
	// 2) for each item in that array, recursively flatten it into a tabular object
	// 3) turn that tabular object into a CSV row using jquery-csv
	var inArray = arrayFrom(json);

	var outArray = [];
	for (var row in inArray)
			outArray[outArray.length] = parse_object(inArray[row]);

	//$("span.rows.count").text("" + outArray.length);

	var csv = $.csv.fromObjects(outArray);
	console.log(csv);
	// excerpt and render first 10 rows
	//renderCSV(outArray.slice(0, excerptRows));
	showCSV(true);

}
