# Installation project
This an example of OpenShift templating engine. It is a second best thing you can do with openshift templating and automated project install.
First best thing would be - templates converted to ansible playbook and run by ansible tower or awx.

What it does:
- Creates projects
- Creates git ssh key
- Deploys Jenkins
- Deploys Pipelines
- Deploys App

\*This installer can only be used to run in Minishift for demo and test purposes.

# Installation
- Start up `minishift start --vm-driver=virtualbox` locally.
- Fork this repository && Clone.
- `cd forked\demo-nodejs-app-on-openshift\installer`
- `oc login` as cluster-admin
- run `bash$: source install.sh <git forked ssh url> <project name> <app name>`
- copy contenst of `installer/repo-at-github.pub` and put it in your github fork under Deployed Keys with write access.