Events = {
  permalink: function() {
    ga('send', 'event', 'permalink', 'created')
  },

  permalink_error: function(value) {
    ga('send', 'event', 'permalink', 'error', "" + value);
  },

  download: function(size) {
    ga('send', 'event', 'download', 'clicked', 'size', size);
  }

}

function getParam(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// adapted from csvkit's recursive JSON flattening mechanism:
// https://github.com/onyxfish/csvkit/blob/61b9c208b7665c20e9a8e95ba6eee811d04705f0/csvkit/convert/js.py#L15-L34

// depends on jquery and jquery-csv (for now)

function parse_object(obj, path) {
    if (path == undefined)
        path = "";

    var type = $.type(obj);
    var scalar = (type == "number" || type == "string" || type == "boolean" || type == "null");

    if (type == "array" || type == "object") {
        var d = {};
        for (var i in obj) {

            var newD = parse_object(obj[i], path + i + "/");
            $.extend(d, newD);
        }

        return d;
    }

    else if (scalar) {
        var d = {};
        var endPath = path.substr(0, path.length-1);
        d[endPath] = obj;
        return d;
    }

    // ?
    else return {};
}


// otherwise, just find the first one
function arrayFrom(json) {
    var queue = [], next = json;
    while (next !== undefined) {
        if ($.type(next) == "array") {

            // but don't if it's just empty, or an array of scalars
            if (next.length > 0) {

              var type = $.type(next[0]);
              var scalar = (type == "number" || type == "string" || type == "boolean" || type == "null");

              if (!scalar)
                return next;
            }
        } if ($.type(next) == "object") {
          for (var key in next)
             queue.push(next[key]);
        }
        next = queue.shift();
    }
    // none found, consider the whole object a row
    return [json];
}

// adapted from Mattias Petter Johanssen:
// https://www.quora.com/How-can-I-parse-unquoted-JSON-with-JavaScript/answer/Mattias-Petter-Johansson
function quoteKeys(input) {
  return input.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ');
}

function removeTrailingComma(input) {
  if (input.slice(-1) == ",")
    return input.slice(0,-1);
  else
    return input;
}

// Rudimentary, imperfect detection of JSON Lines (http://jsonlines.org):
//
// Is there a closing brace and an opening brace with only whitespace between?
function isJSONLines(string) {
 return !!(string.match(/\}\s+\{/))
}

// To convert JSON Lines to JSON:
// * Add a comma between spaced braces
// * Surround with array brackets
function linesToJSON(string) {
  return "[" + string.replace(/\}\s+\{/g, "}, {") + "]";
}

// todo: add graceful error handling
function jsonFrom(input) {
  var string = $.trim(input);
  if (!string) return;

  var result = null;
  try {
    result = JSON.parse(string);
  } catch (err) {
    console.log(err);
  }

  if (result == null) {
    console.log("Parse failed, retrying after forcibly quoting keys and removing trailing commas...")
    var relaxed = quoteKeys(removeTrailingComma(string))
    try {
      result = JSON.parse(relaxed);
      console.log("Yep: quoting keys and removing trailing commas worked!")
    } catch (err) {
      console.log(err);
    }
  }

  // Try to detect if it's a JSON-lines object - if so, we can parse this.
  //
  // However, this should be TRIED LAST, because this could also modify the
  // CONTENT of the strings (it's not precise enough to only target real
  // line breaks) so if the problem was actually something else, then we want to
  // fix that problem instead. (That said, the string content modification
  // would be minimal -- adding a comma between braces, so that's why I feel
  // okay taking this approach.)
  if ((result == null) && isJSONLines(string)) {
    console.log("Parse failed. Looks like it might be JSON lines, retrying...")
    var lines = linesToJSON(string)
    try {
      result = JSON.parse(lines)
      console.log("Yep: it was JSON lines!")
    } catch (err) {
      console.log(err);
      if (lines.length < 5000) console.log(lines);
    }
  }

  if (result == null)
    console.log("Nope: that didn't work either. No good.")

  return result;
}