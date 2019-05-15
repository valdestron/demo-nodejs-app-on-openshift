config = [:]

pipeline {
    agent {
        label 'nodejs'
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
    }

    stages {
        stage('Setup') {
            steps {
                script {
                    configure()
                }
            }
        }

        stage("Build, Test, Lint ....") {
            failFast true
            parallel {
                stage('Unit') {
                    steps {
                        script {
                            dir('src/user') {
                              sh 'npm i'
                              sh 'npm test'
                              sh 'npm run coverage'
                            }
                        }
                    }
                    // do any kinds of post
                    post {
                      always {
                        step([
                            $class: 'CoberturaPublisher',
                            autoUpdateHealth: false,
                            autoUpdateStability: true,
                            coberturaReportFile: '**/coverage/cobertura-coverage.xml', 
                            failUnhealthy: false,
                            failUnstable: true,
                            maxNumberOfBuilds: 0,
                            onlyStable: true,
                            sourceEncoding: 'ASCII',
                            zoomCoverageChart: false
                        ])
                      }
                    }
                }

                stage('Build') {
                    steps {
                        script {
                            build()
                        }
                    }
                }
                stage('Package scanning') {
                    steps {
                        script {
                            echo "should package scanning stage run here"
                        }
                    }
                }
                stage('Lint') {
                    steps {
                        script {
                            echo "Should linting stage run here"
                        }
                    }
                }
            }
        }

        stage("Deploy DEV, TEST") {
            failFast true
            parallel {
                stage('Deploy DEV') {
                    steps {
                        script {
                            deploy(params.DEV_PROJECT)
                        }
                    }
                }

                stage('Deploy TEST') {
                    steps {
                        script {
                            promote(params.TEST_PROJECT)
                            deploy(params.TEST_PROJECT)
                        }
                    }
                }
            }
        }

        stage('TESTSUIT') {
            failFast true
            parallel {
                stage('Integration') {
                    steps {
                        script {
                            script {
                                dir('src/testsuit') {
                                    sh 'npm i'
                                    sh 'npm test'
                                    sh 'npm run coverage'
                                }
                            }
                        }
                    }
                }

                stage('Performance') {
                    steps {
                        script {
                            echo 'Should start jmeteer container and run load'
                        }
                    }
                }

                stage('Chaos') {
                    steps {
                        script {
                            echo 'Should start some bad boys in the projcet and run'
                        }
                    }
                }
            }
        }

        stage('Deploy PROD') {
            steps {
                script {
                    script {
                        promote(params.PROD_PROJECT)
                        deploy(params.PROD_PROJECT)
                    }
                }
            }
        }
        
        stage('Smoke & Report') {
            steps {
                script {
                    script {
                        echo 'Should run some smoke tests against prod and report.'
                    }
                }
            }
        }
    }
}

@NonCPS
def configure() {
  echo "params ${params}"
  
  if (!fileExists(params.VERSION_FILE)) {
    error('VERSION file must be presented with the numeric values e.g.: 0')
    return false
  }

  config.git_commit_id = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
  config.tag = "1.0.${readFile(params.VERSION_FILE).trim().toInteger() + 1}"
  config.build_tag = config.tag + '-build_' + env.BUILD_NUMBER
  config.image_name_prefix = "${params.DEV_PROJECT}/${params.APP_NAME}"
}

@NonCPS
def build() {
  openshift.withProject(params.DEV_PROJECT) {
    def builds = openshift.selector('bc', [ app: params.APP_NAME ])
    def build_objects = builds.objects()


    for (obj in build_objects) {
      obj.spec.output.to.name = params.APP_NAME + '-' + obj.metadata.labels.prefix + ':' + config.build_tag
      openshift.apply(obj)
    }

    builds.withEach {
        build = it.startBuild()
    }

    timeout(100) {
        build.untilEach {
            def phase = it.object().status.phase

            if (phase == 'Complete') {
                return true
            } else if (phase == 'Failed') {
                currentBuild.result = 'FAILURE'
                buildErrorLog = it.logs().actions[0].err
                return true
            } else {
                return false
            }
        }
    }

    if (currentBuild.result == 'FAILURE') {
        error(buildErrorLog)
        return
    }

    for (obj in build_objects) {
        def image_name = "${params.APP_NAME}-${obj.metadata.labels.prefix}:${config.build_tag}"
        
        echo "Tagging ${image_name} as: ${params.APP_NAME}-${obj.metadata.labels.prefix}:latest"
        
        openshift.tag('--source=docker',
            "${image_name}",
            "${params.APP_NAME}-${obj.metadata.labels.prefix}:latest")
    }

  }
}

@NonCPS
def promote (project) {
    openshift.withProject(project) {
        def templateExists = openshift.selector("template/${params.APP_NAME}").exists()

        if (templateExists) {
            openshift.raw("annotate", "template ${params.APP_NAME}",
                "kubectl.kubernetes.io/last-applied-configuration-")
                
            openshift.raw("annotate", "buildconfigs -l app=${params.APP_NAME}",
                "kubectl.kubernetes.io/last-applied-configuration-")

            openshift.raw("annotate", "deploymentconfigs -l app=${params.APP_NAME}",
                "kubectl.kubernetes.io/last-applied-configuration-")
        }

        openshift.apply(readFile(params.TEMPLATE))

        def processed = openshift.process(params.APP_NAME,
            "-l app=${params.APP_NAME}",
            "-p",
            "TAG=${config.tag}",
            "NAMESPACE=${params.DEV_PROJECT}")

        openshift.apply(processed).narrow('bc').delete()
    }
}

@NonCPS
def deploy (project) {
    openshift.withProject(project) {
        def result = null
        def deployments = openshift.selector('dc', [ app: params.APP_NAME ])
        def deploymentObjects = deployments.objects()

        for (obj in deploymentObjects) {
            def image_name = "${project}/${params.APP_NAME}-${obj.metadata.labels.prefix}:${config.build_tag}"

            if (obj.metadata.name == "${params.APP_NAME}-api")  { // hacky,...
                obj.spec.template.spec.containers[1].image = imageName
            } else {
                obj.spec.template.spec.containers[0].image = imageName
            }
            echo "deployment obj ${obj}"
            openshift.apply(obj)
        }
        
        try {
            deployments.rollout().latest()
        } catch (e) {
            echo "${e}"
            echo "Rollout maybe in progress"
        }
        
        timeout(time: 5, unit: 'MINUTES') {
            result = deployments.rollout().status('-w')
        }
        
        if (result.status != 0) {
            error(result.err)
        }
    }
}