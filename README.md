## Complex JSON to CSV Converter

A simple JSON to CSV converter that handles objects and nested documents.

* In the **web** version, conversion happens inside the browser, in straight JavaScript. It may choke on large files.
* With complex-csv2json.js, it can be run via the **command line**. It uses jsonsplit.sh to deal with large files.

To install and run via the command line:
* `npm install -g complex-json2csv`
* type the name of the command and provide an input file 
  * `complex-json2csv inputfile.json` - this will print the output to the screen. 
  * `complex-json2csv inputfile.json > outputfile.csv` - this will print output to a csv file
 * `jsonsplit inputfile.json [records]` - this will split the file into records based on the [records] size
   * If you do not specify size, it defaults to splitting by 100000

(Web tool originally from https://github.com/konklone/json; command line tool complex-csv2json and jsonsplit by [@DanaMLewis](https://github.com/danamlewis).)

Please file all bugs [in the issue tracker](https://github.com/konklone/json/issues).

Read more about the converter and why I (@konklone) built it: "[Making JSON as simple as a spreadsheet](http://sunlightfoundation.com/blog/2014/03/11/making-json-as-simple-as-a-spreadsheet/)".

## Public domain

This project makes uses of certain externally licensed works, including (but not limited to) Bootstrap, Highlight.js, jQuery and jquery-csv. Any such works retain their original license, even if they have been subsequently modified by me.

All **other files** in this project are [dedicated to the public domain](LICENSE). As spelled out in [CONTRIBUTING](CONTRIBUTING.md):

> The project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](http://creativecommons.org/publicdomain/zero/1.0/).

> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.
