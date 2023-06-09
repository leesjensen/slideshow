#!/bin/bash

while getopts k:h:s: flag
do
    case "${flag}" in
        k) key=${OPTARG};;
        h) hostname=${OPTARG};;
    esac
done

if [[ -z "$key" || -z "$hostname" ]]; then
    printf "\nMissing required parameter.\n"
    printf "  syntax: deployFiles.sh -k <pem key file> -h <hostname>\n\n"
    exit 1
fi

printf "\n----> Deploying files to $hostname with $key\n"

# Step 1
printf "\n----> Building distribution.\n"
mkdir dist
cp
#npm install
#npm run build

# Step 2
printf "\n----> Clear out the previous distribution on the target.\n"
ssh -i "$key" ubuntu@$hostname << ENDSSH
rm -rf public_html/jensen
mkdir -p public_html/jensen
ENDSSH

# Step 3
printf "\n----> Copy the distribution package to the target.\n"
scp -r -i "$key" dist/* ubuntu@$hostname:public_html/jensen

# Step 4
rm -rf dist