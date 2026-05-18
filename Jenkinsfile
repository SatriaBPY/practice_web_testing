pipeline {
    agent any

    environment {
        GITHUB_TOKEN = credentials('github-token-actions')
        GITHUB_OWNER = 'SatriaBPY'
        GITHUB_REPO = 'practice_web_testing'
        GITHUB_API_URL = "https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}"
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
        stage('Get Latest Run Number') {
            steps {
                script {
                    def beforeRunNumber = sh(
                        script: """
                            curl -s -H "Authorization: Bearer $GITHUB_TOKEN" \
                            "${GITHUB_API_URL}/actions/workflows/playwright.yml/runs?per_page=1" \
                            | jq -r '.workflow_runs[0].run_number // 0'
                        """,
                        returnStdout: true
                    ).trim()

                    env.BEFORE_RUN_NUMBER = beforeRunNumber
                    echo "Before run number: ${beforeRunNumber}"
                }
            }
        }

        stage('Trigger GitHub Actions') {
            steps {
                script {
                    def triggerId = UUID.randomUUID().toString()
                    env.TRIGGER_ID = triggerId

                    echo "🚀 Triggering workflow with ID: ${triggerId}"

                    sh """
                        curl -s -X POST \\
                        -H "Accept: application/vnd.github+json" \\
                        -H "Authorization: Bearer $GITHUB_TOKEN" \\
                        "${GITHUB_API_URL}/actions/workflows/playwright.yml/dispatches" \\
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
                    """
                }
            }
        }

        stage('Wait & Validate Workflow') {
            steps {
                script {
                    def testFailed = false
                    
                    echo "⏳ Waiting for NEW workflow run..."

                    def runId = null

                    for (int i = 0; i < 60; i++) {
                        runId = sh(
                            script: """
                                curl -s -H "Authorization: Bearer $GITHUB_TOKEN" \
                                "${GITHUB_API_URL}/actions/workflows/playwright.yml/runs?event=workflow_dispatch&per_page=5" \
                                | jq -r '.workflow_runs[]
                                | select(.run_number > ${env.BEFORE_RUN_NUMBER})
                                | .id' | head -1
                            """,
                            returnStdout: true
                        ).trim()

                        if (runId) break
                        echo "⏳ Waiting new run..."
                        sleep 15
                    }

                    if (!runId) {
                        error "❌ Run baru tidak ditemukan"
                    }

                    env.GITHUB_RUN_ID = runId
                    echo "✅ Found NEW Run ID: ${runId}"

                    for (int i = 0; i < 90; i++) {
                        def result = sh(
                            script: """
                                curl -s -H "Authorization: Bearer $GITHUB_TOKEN" \
                                "${GITHUB_API_URL}/actions/runs/${runId}" \
                                | jq -r '.status + "|" + (.conclusion // "pending")'
                            """,
                            returnStdout: true
                        ).trim()

                        def parts = result.tokenize('|')
                        def status = parts[0]
                        def conclusion = parts.size() > 1 ? parts[1].trim() : "pending"

                        echo "Status: ${status}, Conclusion: ${conclusion}"

                        if (status == "completed") {
                            if (conclusion != "success") {
                                echo "❌ Test failed: ${conclusion}"
                                testFailed = true
                                break
                            }
                            echo "✅ Test passed"
                            return
                        }
                        sleep 15
                    }
                    
                    env.TEST_FAILED = testFailed.toString()
                    
                    if (testFailed) {
                        echo "⚠️ Test failed, but continuing to download artifacts..."
                    }
                }
            }
        }

        stage('Download All Artifacts') {
            steps {
                withCredentials([string(credentialsId: 'github-token-actions', variable: 'GITHUB_TOKEN')]) {
                    script {
                        def apiUrl = "https://api.github.com/repos/SatriaBPY/practice_web_testing"
                        
                        sh """
                            rm -rf allure-results
                            mkdir -p allure-results
                            
                            echo "Checking Run ID: ${env.GITHUB_RUN_ID}"
                            
                            ARTIFACT_ID=""
                            MAX_RETRIES=15
                            RETRY_COUNT=0
                            
                            # Looping karena file besar (260MB+) butuh waktu indexing di server GitHub
                            while [ -z "\$ARTIFACT_ID" ] || [ "\$ARTIFACT_ID" == "null" ]; do
                                if [ \$RETRY_COUNT -eq \$MAX_RETRIES ]; then
                                    echo "Error: Telah menunggu lama tapi artifact tetap tidak ditemukan."
                                    exit 1
                                fi
                                
                                echo "Attempting to find artifact (Attempt \$((\$RETRY_COUNT + 1))/\$MAX_RETRIES)..."
                                
                                RESPONSE=\$(curl -s -L \
                                    -H "Authorization: Bearer \$GITHUB_TOKEN" \
                                    -H "Accept: application/vnd.github+json" \
                                    -H "X-GitHub-Api-Version: 2022-11-28" \
                                    "${apiUrl}/actions/runs/${env.GITHUB_RUN_ID}/artifacts")
                                
                                ARTIFACT_ID=\$(echo "\$RESPONSE" | jq -r '.artifacts[] | select(.name | contains("allure")) | .id' | head -1)
                                
                                if [ -z "\$ARTIFACT_ID" ] || [ "\$ARTIFACT_ID" == "null" ]; then
                                    echo "Artifact belum siap (kemungkinan sedang proses zipping di GitHub). Menunggu 20 detik..."
                                    sleep 20
                                    RETRY_COUNT=\$((\$RETRY_COUNT + 1))
                                fi
                            done
                            
                            echo "Found artifact ID: \$ARTIFACT_ID. Downloading (~260MB)..."
                            
                            # Download menggunakan API zip
                            curl -L -H "Authorization: Bearer \$GITHUB_TOKEN" \
                                -o allure.zip \
                                "${apiUrl}/actions/artifacts/\$ARTIFACT_ID/zip"
                            
                            if [ ! -f allure.zip ]; then
                                echo "Error: File allure.zip tidak ditemukan setelah download."
                                exit 1
                            fi
                            
                            echo "Extracting files..."
                            unzip -o allure.zip -d allure-results/
                            rm -f allure.zip
                            
                            echo "Success! Total files in allure-results: \$(ls allure-results/ | wc -l)"
                            ls allure-results/ | head -n 10
                        """
                    }
                }
            }
        }
        
        stage('Publish Allure Report') {
            steps {
                script {
                    echo "📊 Publishing Allure report..."
                    allure commandline: 'allure-cli',
                        includeProperties: false,
                        jdk: '',
                        resultPolicy: 'LEAVE_AS_IS',
                        results: [[path: 'allure-results']]
                    echo "✅ Allure report published"
                }
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
        failure {
            script {
                if (env.TEST_FAILED == 'true') {
                    currentBuild.result = 'FAILURE'
                    echo "Pipeline marked as FAILED because tests failed"
                }
            }
        }
    }
}