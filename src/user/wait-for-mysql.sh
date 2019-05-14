#!/bin/sh
# wait-for-mysql.sh

set -e

host="$1"
shift
cmd="$@"

until nc -z -v -w30 $host 3306
do
  echo "Waiting for mysql Database availablity..."
  sleep 1
done

exit 0