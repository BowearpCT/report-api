docker run --rm -i -v $(pwd):/tmp --network report_api mongo:4.0 bash -c 'cd /tmp/seed/dump/ && mongodump --uri "mongodb://report:reportz!@mongo:27017" --out "../dump"'


mongodump -h localhost:27017 -d report -u report -p reportz -o ./seed/dump
