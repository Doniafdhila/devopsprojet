pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    skipDefaultCheckout(true)
    timeout(time: 30, unit: 'MINUTES')
  }

  environment {
    BACKEND_DIR      = "student-management"
    FRONTEND_DIR     = "frontend"
    npm_config_cache = "${WORKSPACE}/.npm"
  }

  tools {
    nodejs 'node24'
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
        sh 'echo "Checkout done"'
      }
    }

    stage('Backend - Build') {
      steps {
        dir("${env.BACKEND_DIR}") {
          sh 'mvn -B clean package -DskipTests=true'
        }
        sh 'echo "Backend build SUCCESS (JAR generated)"'
      }
    }

    stage('Frontend - Build') {
      steps {
        sh 'echo "PATH=$PATH"'
        sh 'node -v'
        sh 'npm -v'

        dir("${env.FRONTEND_DIR}") {
          sh '''
            set -e
            if [ -f package-lock.json ]; then
              npm ci
            else
              npm install
            fi
            npm run build
          '''
        }

        sh 'echo "Frontend build SUCCESS (dist generated)"'
      }
    }

    stage('Archive Artifacts') {
      steps {
        archiveArtifacts artifacts: "${env.BACKEND_DIR}/target/*.jar", fingerprint: true, allowEmptyArchive: false
        archiveArtifacts artifacts: "${env.FRONTEND_DIR}/dist/**", fingerprint: true, allowEmptyArchive: false
        sh 'echo "Artifacts archived SUCCESS"'
      }
    }
  }

  post {
    always {
      cleanWs(deleteDirs: true, disableDeferredWipeout: true)
    }
  }
}
