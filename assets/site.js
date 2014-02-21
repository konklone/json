// adapted from csvkit's https://github.com/onyxfish/csvkit/blob/master/csvkit/convert/js.py#L8-L27
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

function arrayFrom(json, key) {
    if ($.type(json) == "array")
        return json;
    else if (key)
        return json[key];

    // otherwise, just find the first one
    else {
        for (var key in json) {
            if ($.type(json[key]) == "array")
                return json[key];
        }

        // none found
        return [];
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

function update() {
    var string = $.trim($(".json textarea").val());
    if (!string) return;

    var json = JSON.parse(string);
    var csv = json2csv(json);

    // now, make a data: URI out of it
    // thanks to http://jsfiddle.net/terryyounghk/KPEGU/
    // and http://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
    var uri = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);

    $(".csv").removeClass("nothing");
    $(".csv textarea").val(csv);
    $(".csv a.download").attr("href", uri);

    return false;
}

$(function() {
    $(".json button").click(update);
});