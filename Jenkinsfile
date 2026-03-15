pipeline {
    agent any

    environment {
        AWS_ACCOUNT_ID = "938595516781"
        REGION = "ap-south-2"
        REPO_NAME = "revhire"
    }

    stages {

        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/praneeth0-0/RevHire'
            }
        }

        stage('Build') {
            steps {
                sh '''
                cd BackEnd
                mvn clean package
                '''
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t revhire .'
            }
        }

        stage('Tag Image') {
            steps {
                sh 'docker tag revhire:latest $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$REPO_NAME:latest'
            }
        }

        stage('Push to ECR') {
            steps {
                sh '''
                aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com
                docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$REPO_NAME:latest
                '''
            }
        }

    }
}
