# CI/CD Pipeline Documentation
This document describes the Continuous Integration and Continuous Deployment (CI/CD) pipeline for the Loan Application API.
## Overview
The CI/CD pipeline automates the building, testing, and deployment of the application to AWS Elastic Beanstalk. It uses GitHub Actions as the CI/CD platform.
**Workflow Diagram**
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Code Push  │───►│    Build    │───►│    Test     │───►│   Deploy    │
│  to GitHub  │    │             │    │             │    │  to AWS EB  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
## GitHub Actions Workflow
The workflow is defined in `.github/workflows/ci-cd.yml` and consists of two main jobs:
1. build-and-test: Builds the application and runs tests 
2. deploy-to-elastic-beanstalk: Deploys the application to AWS Elastic Beanstalk (only for the main branch)
## Detailed Workflow Steps
### Triggers
The workflow is triggered on:
- Push to the `main` branch
```yaml
on:
  push:
    branches: [ main ]
```
### Build and Test Job
This job:
- Checks out the code 
- Sets up Node.js
- Installs dependencies 
- Runs tests with the test database
```yaml
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test
        env:
          NODE_ENV: ci
          TEST_DATABASE_HOST: ${{ secrets.TEST_DATABASE_HOST }}
          TEST_DATABASE_PORT: ${{ secrets.TEST_DATABASE_PORT }}
          TEST_DATABASE_NAME: ${{ secrets.TEST_DATABASE_NAME }}
          TEST_DATABASE_USER: ${{ secrets.TEST_DATABASE_USER }}
          TEST_DATABASE_PASSWORD: ${{ secrets.TEST_DATABASE_PASSWORD }}
          DATABASE_HOST: ${{ secrets.TEST_DATABASE_HOST }}
          DATABASE_PORT: ${{ secrets.TEST_DATABASE_PORT }}
          DATABASE_NAME: ${{ secrets.TEST_DATABASE_NAME }}
          DATABASE_USER: ${{ secrets.TEST_DATABASE_USER }}
          DATABASE_PASSWORD: ${{ secrets.TEST_DATABASE_PASSWORD }}
```

### Deploy Job
This job:
- Only runs if the build-and-test job succeeds and it's a push to the main branch 
- Checks out the code 
- Sets up Node.js 
- Installs dependencies 
- Builds the TypeScript code 
- Configures AWS credentials 
- Installs production dependencies 
- Creates a deployment package 
- Deploys to Elastic Beanstalk
```yaml
  deploy-to-elastic-beanstalk:
    needs: build-and-test
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install all dependencies
        run: npm ci

      - name: Compile TypeScript
        run: npx tsc

      - name: Verify build output
        run: |
          echo "Checking build output directory structure:"
          find dist -type f | sort
          test -f dist/app/server.js || (echo "ERROR: dist/app/server.js not found!" && exit 1)
          echo "✅ dist/app/server.js exists"

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-north-1

      - name: Install production dependencies
        run: |
          rm -rf node_modules
          npm ci --only=production

      - name: Generate deployment package
        run: |
          cp app/sequelize-config.js dist/app/
          zip -r deploy.zip dist/ node_modules/ package.json Procfile

      - name: Deploy to Elastic Beanstalk
        uses: einaregilsson/beanstalk-deploy@v21
        with:
          aws_access_key: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws_secret_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          application_name: loan-api
          environment_name: loan-api-env
          version_label: loan-app-${{ github.sha }}
          region: eu-north-1
          deployment_package: deploy.zip
          use_existing_version_if_available: true
          wait_for_environment_recovery: 300
```

### **GitHub Secrets Configuration**
The following secrets need to be configured in the GitHub repository:
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- TEST_DATABASE_HOST
- TEST_DATABASE_PORT
- TEST_DATABASE_NAME
- TEST_DATABASE_USER
- TEST_DATABASE_PASSWORD

### Main Branch Deployment
When code is pushed to the main branch:

- The build-and-test job runs to verify the changes
- If tests pass, the deployment job automatically deploys to Elastic Beanstalk

### Deployment Package Structure
The deployment package `(deploy.zip)` contains:
- `dist/` - Compiled TypeScript code 
- `node_modules/` - Production dependencies 
- `package.json` - Package configuration 
- `Procfile` - Elastic Beanstalk process configuration

### Rollback Procedure
In case of a failed deployment:
- Navigate to the Elastic Beanstalk console 
- Select the environment 
- Go to "Application versions"
- Select a previous working version 
- Click "Deploy"
