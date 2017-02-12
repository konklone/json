#!/bin/bash

# exit immediately on any errors
set -eu

#get input file
fullinputfile=$1
inputfile=${fullinputfile%.json}
partsdir=${inputfile}_parts

#if not specified, then set the records to 100,000
if [ -z $2 ] ; then 
    records=100000
else
    records=$2
fi

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
