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
