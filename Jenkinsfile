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

        stage('Frontend: Build') {
            steps {
                sh '''
                cd FrontEnd/Frontend
                npm install
                npm run build -- --configuration=production
                '''
            }
        }

        stage('Tag Images') {
            steps {
                sh '''
                docker tag revhire-backend:latest $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$REPO_NAME:latest
                '''
            }
        }

        stage('Push Backend to ECR') {
            steps {
                sh '''
                aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com
                docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$REPO_NAME:latest
                '''
            }
        }

        stage('Deploy Frontend to S3') {
            steps {
                sh '''
                aws s3 sync FrontEnd/Frontend/dist/revhire-frontend/browser s3://<YOUR_S3_BUCKET_NAME> --delete
                '''
            }
        }

        stage('Deploy Backend to EC2') {
            steps {
                sh '''
                aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com
                docker-compose -f docker-compose.prod.yml pull backend
                docker-compose -f docker-compose.prod.yml up -d backend
                '''
            }
        }

    }
}
