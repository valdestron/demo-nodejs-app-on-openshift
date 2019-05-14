#!/bin/bash

project=${1-"user-manager"}
app={$2-"user-manager"}

clean () {
  local a_project=${1-$project}
  echo "----------- Cleaning ${a_project}"
  oc project $a_project
  oc delete --all -l app=$project || true
  oc delete template $project || true
  oc delete template $project-mysql || true
  oc delete template $project-pipeline || true
  oc delete project $a_project
}

clean "${project}-dev"
clean "${project}-test"
clean
