#! /bin/bash

cd build/images
FILES=$(find * -type f | grep -v ' ' | awk -v q="'" '{print " -F " q "file=@\"" $0 "\";filename=\"" $0 "\"" q}')
curl -X POST "http://localhost:5001/api/v0/add?pin=true&recursive=true&wrap-with-directory=true" $FILES -H "Content-Type: multipart/form-data"
cd ../..
