### Testing JSON, JSON5, JSON Lines, and more

Examples to test this tool with. Each `.json` file has a corresponding `.csv` file with the intended output.

#### JSON examples

In `json/`, example JSON-compatible files:

* `basic.json` - Basic example of JSON data. (From [this URL](https://open.gsa.gov/data.json), 2018-10-27.)
* `basic-huge.json` - Basic example, but the array extended many times to form a large (~1MB) file. (2018-10-27)
* `smart-quotes.json` - An example of "smart quotes". (From [this URL](https://konklone.io/json/?id=a41655b3193a4d3ee472dfb94952c412), 2018-10-27.)

#### JSON5 examples

In `json5/`, example JSON5-compatible files:

* `canonical.json` - Canonical example from JSON5 README. Exercises many features.
* `canonical-huge.json` - Canonical example, but made into a large (multiple MB) array of these values, to test large files.
* `single-quotes.json` - Single quoted keys and string values. (From [this URL](https://konklone.io/json/?id=97633f7946f33f88f983), 2018-10-27.)
* `unquoted-keys.json` - Unquoted object keys.
* `trailing-comma-object.json` - A trailing comma at the end of an object.
* `trailing-comma-value.json` - A trailing comma within an object, at the end of a string value.

#### Other examples

In `other/`, other examples that test other behavior of this tool:

* `json-lines.json` - An example of [JSON Lines](http://jsonlines.org). (From [this URL](http://jsonlines.org/examples/), 2018-10-27.)
* `ignore-scalar-arrays.json` - Tests that sub-arrays which are just scalars of strings are ignored during "array hunting". (Adapted from [this URL](https://konklone.io/json/?id=41148dc8ca9f6771d4e2), 2018-10-27.)


