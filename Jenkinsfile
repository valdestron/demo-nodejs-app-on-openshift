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
    }
}

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
        def image_name = config.image_name_prefix + '-' + obj.metadata.labels.prefix + '-' + config.build_tag
        
        echo "Tagging ${image_name} as: ${openshift.project()}/${params.APP_NAME}-${obj.metadata.labels.prefix}:latest"
        
        openshift.tag('--source=docker',
            "${image_name}",
            "${openshift.project()}/${params.APP_NAME}-${obj.metadata.labels.prefix}:latest")
    }

  }
}