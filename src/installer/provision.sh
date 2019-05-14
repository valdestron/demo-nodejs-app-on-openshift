#!/bin/bash

project=${1-"user-manager"}
app=${2-"user-manager"}
pipeline=${3-"pipeline.yml"}
jenkins=${4-"jenkins.yml"}
template=${5-"user-manager.yml"}
db_template=${6-"user-manager-mysql.yml"}

clean () {
  local a_project=${1-$project}
  echo "------------------------------------ Cleaning before install: ${a_project} ${app} ------------------------------------"
  oc project $a_project
  oc delete all -l app=$app || true
  oc delete template $app || true
  oc delete template $app-mysql || true
  oc delete template $app-pipeline || true
  oc delete project $a_project
}

setup_projects() {
  echo "------------------------------------ Setup all ${project}'s by env ------------------------------------"
  oc new-project $project-dev || true > /dev/null
  oc new-project $project-test || true > /dev/null
  oc new-project $project || true > /dev/null
}

install_jenkins() {
  echo "------------------------------------ Jenkins ${project} ------------------------------------"
  oc delete svc/jenkins || true
  oc delete svc/jenkins-jnlp || true
  oc delete pvc/jenkins || true
  oc project $project-dev
  oc process -f $jenkins | oc create -f -
}

pipeline() {
  echo "------------------------------------ Pipeline ${app} ------------------------------------"
  oc project $project-dev > /dev/null
  oc process -f $pipeline | oc create -f -
}

app_template() {
  echo "------------------------------------ App Template ${project} ------------------------------------"
  oc process -f $template | oc create -f -
}

db_template() {
  echo "------------------------------------ DB Template ${project} ------------------------------------"
  oc process -f $db_template | oc create -f -
}

clean "${project}-dev"
clean "${project}-test"
clean

setup_projects
install_jenkins
pipeline

app_template
db_template

echo "*****"
echo "* Finished Installation. Using account $(oc whoami)"
echo "* Project: ${project}, App: ${app}"
echo "*"
echo "*"
echo "* Created projects: ${project}-dev, ${project}-test, ${project}"
echo "* Jenkins instance available in: ${project}-dev"
echo "* Pipeline available in: ${project}-dev"
echo "* App available in: ${project}-dev"
echo "*"
echo "*"
echo "* Run pipeline in ${project}-dev if you want deploy ${app} app in other environments ${project}-test and ${project}"
echo "*"
echo "*"
echo "*****"