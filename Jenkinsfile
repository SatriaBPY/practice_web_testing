pipeline {
    agent any

    environment {
        GITHUB_TOKEN = credentials('github-token-actions')
        GITHUB_OWNER = 'SatriaBPY'
        GITHUB_REPO = 'practice_web_testing'
        RUN_ID = ''
    }

    parameters {
        choice(
            name: 'ENV',
            choices: ['QA', 'STAGING'],
            description: 'Pilih environment'
        )
        choice(
            name: 'TEST_TYPE',
            choices: ['smoke', 'regression', 'flaky', 'serial', 'test2', 'e2e'],
            description: 'Jenis test'
        )
        string(
            name: 'WORKERS',
            defaultValue: '4',
            description: 'Jumlah worker'
        )
        booleanParam(
            name: 'HEADED',
            defaultValue: false,
            description: 'Mode headed?'
        )
        booleanParam(
            name: 'DEBUG',
            defaultValue: false,
            description: 'Mode debug?'
        )
    }

    stages {
        stage('Trigger GitHub Actions Self-Hosted') {
            steps {
                script {
                  
                    def response = sh(script: """
                        curl -X POST \
                        -H "Authorization: token ${GITHUB_TOKEN}" \
                        -H "Accept: application/vnd.github.v3+json" \
                        https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/workflows/playwright.yml/dispatches \
                        -d '{
                            "ref": "main",
                            "inputs": {
                                "ENV": "${params.ENV}",
                                "TEST_TYPE": "${params.TEST_TYPE}",
                                "WORKERS": "${params.WORKERS}",
                                "HEADED": ${params.HEADED},
                                "DEBUG": ${params.DEBUG}
                            }
                        }'
                    """, returnStdout: true)
                    
                    echo "Workflow triggered successfully"
                }
            }
        }
        
        stage('Wait for GitHub Actions to Complete') {
            steps {
                script {
                    
                    sleep time: 10, unit: 'SECONDS'
                    
                  
                    def runs = sh(script: """
                        curl -s -H "Authorization: token ${GITHUB_TOKEN}" \
                        https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/runs?status=in_progress,queued
                    """, returnStdout: true)
                    
                   
                    def runId = sh(script: """
                        echo '$runs' | jq '.workflow_runs[0].id // empty'
                    """, returnStdout: true).trim()
                    
                    if (runId) {
                        env.RUN_ID = runId
                        echo "Found workflow run ID: ${RUN_ID}"
                    } else {
                        error "Tidak bisa menemukan workflow run ID"
                    }
                    
                   
                    def status = ""
                    while (status != "completed") {
                        sleep time: 30, unit: 'SECONDS'
                        
                        def runInfo = sh(script: """
                            curl -s -H "Authorization: token ${GITHUB_TOKEN}" \
                            https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/runs/${RUN_ID}
                        """, returnStdout: true)
                        
                        status = sh(script: """
                            echo '$runInfo' | jq -r '.status // "unknown"'
                        """, returnStdout: true).trim()
                        
                        def conclusion = sh(script: """
                            echo '$runInfo' | jq -r '.conclusion // "pending"'
                        """, returnStdout: true).trim()
                        
                        echo "Status: ${status}, Conclusion: ${conclusion}"
                    }
                }
            }
        }
        
        stage('Download Allure Report Artifact') {
            steps {
                script {
                    // Download artifact dari GitHub Actions
                    sh """
                        curl -L \
                        -H "Authorization: token ${GITHUB_TOKEN}" \
                        -H "Accept: application/vnd.github.v3+json" \
                        https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/runs/${RUN_ID}/artifacts \
                        -o artifacts.json
                    """
                    
                    // Cari artifact ID untuk allure-results
                    def artifactId = sh(script: """
                        cat artifacts.json | jq -r '.artifacts[] | select(.name | contains("allure-results")) | .id' | head -1
                    """, returnStdout: true).trim()
                    
                    if (artifactId) {
                        sh """
                            curl -L \
                            -H "Authorization: token ${GITHUB_TOKEN}" \
                            https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/artifacts/${artifactId}/zip \
                            -o allure-results.zip
                            
                            unzip -o allure-results.zip -d allure-results/
                        """
                        echo "Allure results downloaded successfully"
                    } else {
                        echo "No allure-results artifact found"
                    }
                }
            }
        }
        
        stage('Publish Allure Report') {
            steps {
                allure commandline: 'allure-cli', 
                       includeProperties: false, 
                       jdk: '', 
                       resultPolicy: 'LEAVE_AS_IS',
                       results: [[path: 'allure-results']]
            }
        }
    }

    post {
        always {
            script {
                echo "Tests completed, cleaning up..."
                sleep time: 3, unit: 'SECONDS'
                cleanWs()
            }
        }
    }
}