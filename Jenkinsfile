pipeline {
    agent any

    options {
        timestamps()
    }

    environment {
        NODE_OPTIONS = "--max-old-space-size=512"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                url: 'https://github.com/praneeth0-0/RevHire.git'
            }
        }

        stage('Build Backend') {
            steps {
                dir('BackEnd') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Restart Backend') {
            steps {
                sh '''
                echo "Stopping existing backend if running..."
                pkill -f RevHire-HiringPlatform || true

                echo "Starting backend..."
                nohup java -jar BackEnd/target/RevHire-HiringPlatform-0.0.1-SNAPSHOT.jar > backend.log 2>&1 &
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                dir('FrontEnd/Frontend') {
                    sh '''
                    npm ci --legacy-peer-deps
                    npm run build
                    '''
                }
            }
        }

        stage('Deploy Frontend') {
            steps {
                sh '''
                echo "Deploying frontend to Nginx..."

                sudo rm -rf /var/www/html/*
                sudo cp -r FrontEnd/Frontend/dist/revhire-frontend/browser/* /var/www/html/
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
    }
}
