#!/bin/bash

#get input file
inputfile=$1
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
cat $inputfile | jq -c -M '.[]' | split -l $records - $partsdir/${inputfile}_

#before json -g we need to get rid of existing jsons
rm $partsdir/*.json 2>&1 | grep -v "No such file"

#converts chunked files into json array
cd $partsdir/; ls | while read file; do cat $file | json -g > $file.json; done; cd ..
