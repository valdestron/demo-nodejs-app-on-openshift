# User Manager Demo APP for DevDays speach
An example app to be deployed in OpenShift cluster. This app will be part of "Exclude Human - Continuous Deployment and OpenShift" talk.

How to install on your local [minishift](./src/installer)

# Characteristics
- Can be installed in OpenShift/Minishift v3.11
- On PR, - PR Pipeline runs and preview environment is created in the configured OpenShift Cluster
- On Merge to Master - Main Pipeline is triggered and if all tests and stages passes - deployed to production

# Containers
- MySql
- APP
- API
- TestSuit

# Local Development
- Clone
- `docker-compose up -d`
- To run migrations and seeds: `cd src/user && yarn migrations && yarn seeds`
- To run APP unit tests `cd src/user-manager && yarn test`
- To run API unit tests `cd src/user && yarn test`
- To run API integration tests `cd src/testsuit && yarn test`
