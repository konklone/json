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

// todo: add graceful error handling
function jsonFrom(input) {
  var string = $.trim(input);
  if (!string) return;

  var result = null;
  try {
    result = JSON.parse(string);
  } catch (err) {
    console.log(err);
    console.log("Parse failed, retrying after forcibly quoting keys and removing trailing commas...")

    try {
      result = JSON.parse(quoteKeys(removeTrailingComma(string)))
      console.log("Yep: quoting keys and removing trailing commas worked.")
    } catch (err) {
      console.log(err);
      console.log("Nope: that didn't work either. No good.")
    }
  }

  return result;
}