#!/bin/sh
# wait-for-mysql.sh

set -e

host="$1"
shift
cmd="$@"

until nc -z -v -w30 $host 3306
do
  echo "Waiting for database connection..."
  sleep 1
done

exit 0