#!/bin/bash

git_repo=${1-"git@github.com:valdestron/demo-nodejs-app-on-openshift.git"}
project=${2-"user-manager"}
app=${3-"user-manager"}

pipeline="pipeline.yml"
jenkins="jenkins.yml"
template="user-manager.yml"
db_template="user-manager-mysql.yml"
repo_at_github="repo-at-github.yml"

clean () {
  local a_project=${1-$project}
  echo "------------------------------------ Cleaning before install: ${a_project} ${app}"
  oc project $a_project
  oc delete all -l app=$app || true
  oc delete template $app || true
  oc delete template $app-mysql || true
  oc delete template $app-pipeline || true
  oc delete project $a_project
}

setup_projects() {
  echo "------------------------------------ Setup all ${project}'s by env"
  oc new-project $project-dev >/dev/null
  oc new-project $project-test >/dev/null
  oc new-project $project >/dev/null
}

setup_git_ssh() {
  echo "------------------------------------ Git SSH Key ${project}"
  yes "y" | ssh-keygen -C "openshift-source-builder/repo@github" -f repo-at-github -N '' >/dev/null
  secret=$(sed "s/ssh-privatekey:.*/ssh-privatekey: $(cat repo-at-github | base64)/" repo-at-github.yml)
  echo "${secret}" > repo-at-github.yml
  oc delete secret/git
  oc create -f repo-at-github.yml
}

install_jenkins() {
  echo "------------------------------------ Jenkins ${project}"
  oc delete svc/jenkins || true
  oc delete svc/jenkins-jnlp || true
  oc delete pvc/jenkins || true
  oc project $project-dev
  oc process -f $jenkins | oc create -f -
}

pipeline() {
  echo "------------------------------------ Pipeline ${app}"
  oc project $project-dev > /dev/null
  oc process -f $pipeline | oc create -f -
}

app_template() {
  echo "------------------------------------ App Template ${project}"
  oc process -f $template | oc create -f -
}

db_template() {
  echo "------------------------------------ DB Template ${project}"
  oc process -f $db_template | oc create -f -
}

clean "${project}-dev"
clean "${project}-test"
clean

setup_projects
setup_git_ssh
install_jenkins
pipeline

app_template
db_template

echo "*****"
echo "* Used oc account                $(oc whoami)"
echo "* Project namespace:             ${project}"
echo "* App:                           ${app}"
echo "*"
echo "*"
echo "* Created projects:              ${project}-dev, ${project}-test, ${project}"
echo "* Jenkins instance available in: ${project}-dev"
echo "* Pipeline available in:         ${project}-dev"
echo "* App available in:              ${project}-dev"
echo "*"
echo "*"
echo "* Run pipeline in ${project}-dev if you want deploy ${app} app in other environments ${project}-test and ${project}"
echo "*"
echo "*"
echo "* Add this key to Deployed Keys in Github Fork:"
echo "$(cat repo-at-github.pub)"
echo "*"
echo "*****"