pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        NODE_OPTIONS = "--max-old-space-size=512"
        BACKEND_JAR = "BackEnd/target/RevHire-HiringPlatform-0.0.1-SNAPSHOT.jar"
        FRONTEND_BUILD = "FrontEnd/Frontend/dist/revhire-frontend/browser"
        NGINX_PATH = "/var/www/html"
        S3_BUCKET = "revhire-frontend-praneeeth"
        AWS_REGION = "ap-south-2"
    }

    stages {

        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                url: 'https://github.com/praneeth0-0/RevHire.git'
            }
        }

        stage('Build Backend') {
            steps {
                dir('BackEnd') {
                    sh '''
                    echo "Building Spring Boot backend..."
                    mvn clean package -DskipTests
                    '''
                }
            }
        }

        stage('Restart Backend') {
            steps {
                sh '''
                echo "Stopping existing backend process..."
                pkill -f RevHire-HiringPlatform || true

                echo "Starting backend..."
                nohup java -jar $BACKEND_JAR > backend.log 2>&1 &
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                dir('FrontEnd/Frontend') {
                    sh '''
                    echo "Cleaning old dependencies..."
                    rm -rf node_modules package-lock.json

                    echo "Installing dependencies..."
                    npm install --legacy-peer-deps

                    echo "Building Angular project..."
                    export NODE_OPTIONS="--max-old-space-size=512"
                    npm run build
                    '''
                }
            }
        }

        stage('Deploy Frontend to EC2 Nginx') {
            steps {
                sh '''
                echo "Deploying frontend to Nginx..."

                sudo rm -rf $NGINX_PATH/*
                sudo cp -r $FRONTEND_BUILD/* $NGINX_PATH/
                '''
            }
        }

        stage('Deploy Frontend to S3') {
            steps {
                sh '''
                echo "Uploading frontend to S3..."

                aws s3 sync $FRONTEND_BUILD/ s3://$S3_BUCKET \
                --delete \
                --region $AWS_REGION \
                --cache-control max-age=0
                '''
            }
        }

    }

    post {

        success {
            echo "Deployment Successful"
        }

        failure {
            echo "Pipeline Failed"
        }

        cleanup {
            cleanWs()
        }
    }
}
