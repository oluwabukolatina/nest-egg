# AWS Infrastructure and Security Setup

This document outlines the AWS infrastructure setup and security practices for the Loan Application API, including CI/CD automation through GitHub Actions.

## Architecture Overview

```
┌────────────────┐     ┌─────────────────┐     ┌────────────────────┐     ┌───────────────────┐
│                │     │                 │     │                    │     │                   │
│  GitHub        ├────►│  CodePipeline   ├────►│  Elastic Beanstalk ├────►│  RDS PostgreSQL   │
│  Repository    │     │  (CI/CD)        │     │  (Application)     │     │  (Database)       │
│                │     │                 │     │                    │     │                   │
└────────────────┘     └─────────────────┘     └──────────┬─────────┘     └───────────────────┘
                                                          │
                                                          ▼
                                               ┌───────────────────┐
                                               │                   │
                                               │  CloudWatch       │
                                               │  (Monitoring)     │
                                               │                   │
                                               └───────────────────┘
```
## AWS Infrastructure Architecture
The deployment consists of the following AWS services:
1. Elastic Beanstalk - For hosting the Node.js application 
2. RDS PostgreSQL - For the database 
3. IAM - For security and access control 
4. CloudWatch - For monitoring and logging

## AWS Resources Configuration

### 1. Elastic Beanstalk Environment Setup

#### Step 1: Create an Application
1. Sign in to the AWS Management Console
2. Navigate to the Elastic Beanstalk service
3. Click "Create application"
4. Enter application name: `your-application-name`
5. Click "Create"

#### Step 2: Create an Environment
1. Select "Web server environment"
2. Fill in environment details:
   - Environment name: `your-application-name`
   - Domain: (accept default or customize)
   - Platform: Node.js
   - Platform branch: Node.js 18
3. Click "Configure more options"

#### Step 3: Configure Environment Settings
1. Navigate to Elastic Beanstalk console and click "Create application"
2. Application name: `your-application-name`
3. Application code: Sample application as the code is deployed via Github action
4. Click "Configure more options" and modify:
   **Software section**:
   - Set Node.js version to 18
   - Set environment variables
     - NODE_ENV=production
     - DATABASE_HOST=your-db-endpoint.eu-north-1.rds.amazonaws.com
     - DATABASE_PORT=5432 
     - DATABASE_NAME= 
     - DATABASE_USER= 
     - DATABASE_PASSWORD=
5. **Instances section:**
   - EC2 instance type: t3.micro 
   - Enable instance profile
6. **Capacity section:**
- Environment type: Load balanced for production, Single instance for dev
- Min instances: 1, Max instances: 2 (adjust based on expected load)
- **Security section:** 
  - Service role: Create a new service role or select existing
7. Click "Create environment"

### 2. RDS PostgreSQL Security Configuration

After your environment is created:

1. Go to the RDS console to find your database instance
2. Select your database instance
3. Go to "Connectivity & Security" tab
4. Ensure encryption is enabled
5. Verify the security group settings
6. Go to the "Maintenance" tab and enable auto minor version upgrades

### 3. IAM Role and Policy Configuration

#### Create a Custom Policy for RDS Access:
1. Go to IAM console → Policies → Create policy
2. Use the following JSON:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "rds:DescribeDBInstances",
        "rds-db:connect"
      ],
      "Resource": [
        "arn:aws:rds:{region}:{account-id}:db:loan-application-db",
        "arn:aws:rds-db:{region}:{account-id}:dbuser:*/*"
      ]
    }
  ]
}
```
3. Name it "LoanApplicationRDSAccess"
4. Create the policy

#### Attach Policies to Elastic Beanstalk Instance Profile:
1. Go to IAM console → Roles
2. Find the role used by your Elastic Beanstalk instances (usually named like aws-elasticbeanstalk-ec2-role)
3. Attach the following policies:
   - LoanApplicationRDSAccess (your custom policy)
   - CloudWatchAgentServerPolicy
   - AWSElasticBeanstalkWebTier

## CI/CD Setup with GitHub Actions

### Step 1: Configure GitHub Repository

1. Push your code to a GitHub repository
2. Go to Settings → Secrets and variables → Actions
3. Add the following repository secrets:
   - AWS_ACCESS_KEY_ID: (your IAM user access key)
   - AWS_SECRET_ACCESS_KEY: (your IAM user secret key)
   - AWS_REGION: (your AWS region, e.g., us-east-1)

### Step 2: Create GitHub Actions Workflow File

Create the file `.github/workflows/ci-cd.yml` in your repository:

```yaml
name: CI/CD Pipeline

on:
   push:
      branches: [ main ]
   pull_request:
      branches: [ main ]

jobs:
   build-and-test:
      runs-on: ubuntu-latest

      services:
         postgres:
            image: postgres:14
            env:
               POSTGRES_USER: postgres
               POSTGRES_PASSWORD: postgres
               POSTGRES_DB: test_db
            ports:
               - 5432:5432
            options: >-
               --health-cmd pg_isready
               --health-interval 10s
               --health-timeout 5s
               --health-retries 5

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

### Step 3: Trigger the Workflow
1. Commit and push this workflow file to your main branch
2. GitHub Actions will automatically start the deployment process
3. You can monitor the progress in the "Actions" tab of your GitHub repository


## Security Best Practices

### 1. Data Protection
- Enable encryption at rest for RDS (enabled by default on newer instances)
- Ensure SSL/TLS connections to the database
- Use HTTPS for all API endpoints
- Encrypt sensitive data in environment variables

### 2. Identity and Access Management
- Use IAM roles instead of IAM users for service authentication
- Follow principle of least privilege for all IAM policies
- Regularly rotate all credentials
- Use Multi-Factor Authentication (MFA) for all IAM users

### 3. Network Security
- Place RDS in a private subnet
- Use security groups to restrict access
