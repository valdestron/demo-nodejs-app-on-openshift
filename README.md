# Anti Human App - Demo for DevDays talk
An example app to be deployed in OpenShift cluster. This app will be part of "Exclude Human - Continuous Deployment and OpenShift" talk.

# Characteristics
- Can be installed in any OpenShift/Minishift v3.11
- On PR, - PR Pipeline runs and preview environment is created in the configured OpenShift Cluster
- On Merge to Master - Main Pipeline is triggered and if all tests and stages passes - deployed to production

# Containers
- MySql
- APP
- API
- TestSuit

# Local Development
- Clone
- `docker-compose -f docker-compose.all.yml up -d` - will start everything and app can be accessed by `http://localhost:3002`
- To run migrations and seeds: `cd src/user && yarn migrations && yarn seeds`
- To run integration tests `cd src/testsuit && yarn test`