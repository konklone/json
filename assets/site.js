function getParam(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// adapted from csvkit's recursive JSON flattening mechanism:
// https://github.com/onyxfish/csvkit/blob/master/csvkit/convert/js.py#L8-L27

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
function arrayFrom(json, key) {
    if ($.type(json) == "array")
        return json;
    else if (key)
        return json[key];

    else {
        for (var key in json) {
            if ($.type(json[key]) == "array")
                return json[key];
        }

        // none found, consider the whole object a row
        return [json];
    }
}

// 1) find the primary array to iterate over
// 2) for each item in that array, recursively flatten it into a tabular object
// 3) turn that tabular object into a CSV row using jquery-csv
function json2csv(json) {
    var inArray = arrayFrom(json);

    var outArray = [];
    for (var row in inArray)
        outArray[outArray.length] = parse_object(inArray[row]);

    return $.csv.fromObjects(outArray);
}

// todo: add graceful error handling
function jsonFrom(input) {
  var string = $.trim(input);
  if (!string) return;
  return JSON.parse(string);
}