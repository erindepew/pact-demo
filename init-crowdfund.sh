#!/bin/sh
set -e

JSON="Content-Type: application/json"

if [ -z "$1" ];
then
  echo 'Server port must be supplied; ex: ./initialize-crowdfund.sh 9001'
  exit 1
fi

pact -a load-coin-contract.yaml | curl -H "$JSON" -d @- http://localhost:$1/api/v1/send

pact -a load-crowdfund.yaml | curl -H "$JSON" -d @- http://localhost:$1/api/v1/send
