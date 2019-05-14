#/bin/bash

#yes "y" | ssh-keygen -C "openshift-source-builder/repo@github" -f repo-at-github -N ''
#sed -i -e "s/ssh-privatekey: /ssh-privatekey: $(cat repo-at-github | base64)/" repo-at-github.yml
#aa=$(sed -i "s/\(.*apiVersion:.*\)/aaa: 1000/g" repo-at-github.yml)

yes "y" | ssh-keygen -C "openshift-source-builder/repo@github" -f repo-at-github -N '' >/dev/null
aa=$(sed "s/ssh-privatekey:.*/ssh-privatekey: $(cat repo-at-github | base64)/" repo-at-github.yml)
echo "${aa}" > repo-at-github.yml
oc delete secret/git
oc create -f repo-at-github.yml