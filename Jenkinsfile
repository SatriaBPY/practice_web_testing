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
        stage('Trigger GitHub Actions Self-Hosted') {
            steps {
                script {
                   
                    sh """
                        curl -X POST \
                        -H "Authorization: token ${GITHUB_TOKEN}" \
                        -H "Accept: application/vnd.github.v3+json" \
                        https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/workflows/playwright.yml/dispatches \
                        -d '{
                            "ref": "main",
                            "inputs": {
                                "env": "${params.ENV}",
                                "test_type": "${params.TEST_TYPE}",
                                "workers": "${params.WORKERS}",
                                "headed": "${params.HEADED}",
                                "debug": "${params.DEBUG}"
                            }
                        }'
                    """
                }
            }
        }
    }
}