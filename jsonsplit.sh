#!/bin/bash

# exit immediately on any errors
set -eu

#if not specified, then set the records to 100,000
if [ $# -eq 0 ]; then
    echo "Error: Please provide an input file. "
    echo "Usage: $0 inputfile.json [records]"
    exit    
elif [ $# -eq 1 ]; then
    records=100000
else
    records=$2
fi

#get input file
fullinputfile=$1
inputfile=${fullinputfile%.json}
partsdir=${inputfile}_parts

#create a directory to store the split files
mkdir -p $partsdir 

#splits the input file into (record size) chunks
cat $fullinputfile | jq -c -M '.[]' | split -l $records - $partsdir/${inputfile}_

#before json -g we need to get rid of existing jsons
rm $partsdir/*.json 2>&1 | grep -v "No such file" || echo -n ""

#converts chunked files into json array
cd $partsdir/
ls | while read file; do echo -n "." > /dev/stderr; done; echo > /dev/stderr
echo "Grouping split records into valid json..."
ls | while read file; do
  cat $file | json -g > $file.json
  echo -n "-" > /dev/stderr
done
echo > /dev/stderr
cd ..
