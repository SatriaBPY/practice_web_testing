pipeline {
    agent any

    parameters {
        choice(
            name: 'ENV',
            choices: ['QA', 'STAGING'],
            description: 'Select environment'
        )

        choice(
            name: 'TEST_TYPE',
            choices: [
                'smoke',
                'regression',
                'flaky',
                'flakyDebug',
                'serial',
                'test2',
                'e2e'
            ],
            description: 'Select test suite'
        )

        booleanParam(
            name: 'HEADED',
            defaultValue: false,
            description: 'Run headed mode (useful for debugging)'
        )

        booleanParam(
            name: 'DEBUG',
            defaultValue: false,
            description: 'Run with Playwright debug mode'
        )

        string(
            name: 'WORKERS',
            defaultValue: '4',
            description: 'Number of workers'
        )
    }

    environment {
        ENV = "${params.ENV}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Run Tests') {
            steps {
                script {

                    def cmd = "npx playwright test"

                   
                    cmd += " --grep @${params.TEST_TYPE}"

                  
                    cmd += " --workers=${params.WORKERS}"

                    
                    if (params.HEADED) {
                        cmd += " --headed"
                    }

                  
                    if (params.DEBUG) {
                        cmd = "PWDEBUG=1 " + cmd
                    }

                    echo "Running command: ${cmd}"

                    sh cmd
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
            archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
        }
    }
}