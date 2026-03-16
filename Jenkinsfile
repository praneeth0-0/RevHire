pipeline {
    agent any

    environment {
        AWS_ACCOUNT_ID = "938595516781"
        REGION = "ap-south-2"
        REPO_NAME = "revhire"
    }

    stages {

        stage('Backend: Build & Package') {
            steps {
                sh '''
                cd BackEnd
                mvn clean package
                '''
            }
        }

        stage('Backend: Docker Build') {
            steps {
                sh '''
                cd BackEnd
                docker build -t revhire-backend .
                '''
            }
        }

        stage('Frontend: Docker Build') {
            steps {
                sh '''
                cd FrontEnd/Frontend
                docker build -t revhire-frontend .
                '''
            }
        }

        stage('Tag Images') {
            steps {
                sh '''
                docker tag revhire-backend:latest $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$REPO_NAME:latest
                docker tag revhire-frontend:latest $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$REPO_NAME:frontend-latest
                '''
            }
        }

        stage('Push to ECR') {
            steps {
                sh '''
                aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com
                docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$REPO_NAME:latest
                docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$REPO_NAME:frontend-latest
                '''
            }
        }

    }
}
