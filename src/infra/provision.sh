#!/bin/bash

project=${1-"user-manager"}
pipeline=${2-"pipeline.yml"}
jenkins=${3-"jenkins.yml"}
template=${4-"user-manager.yml"}

clean() {
  echo "-- Cleaning ${project} --"
  oc delete all -l app=$project || true
  oc delete all -l app=$project-pipeline || true
  oc delete template $project || true
  oc delete template $project-pipeline || true
  oc delete bc $project-pipeline --ignore-not-found
}

pipeline() {
  echo "-- Pipeline ${project} --"
  oc project $project-dev > /dev/null
  oc process -f $pipeline | oc create -f -
}

template() {
  echo "-- Template ${project} --"
  oc process -f $template | oc create -f -
}

install_jenkins() {
  echo "-- Jenkins ${project} --"
  oc delete $project-dev
  oc new-project $project-dev || true > /dev/null
  oc new-project $project-test || true > /dev/null
  oc new-project $project || true > /dev/null
  oc delete svc/jenkins || true
  oc delete svc/jenkins-jnlp || true
  oc process -f $jenkins | oc create -f -
}

if oc get svc/jenkins ; then
  echo "Jenkins already on the system"
else
  install_jenkins
fi

clean
pipeline
template
