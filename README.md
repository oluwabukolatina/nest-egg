# Loan Application API

A Node.js app for loan application processing.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Local Setup](#local-setup)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [AWS Deployment](#aws-deployment)
- [Security](#security)
- [CI/CD Pipeline](#cicd-pipeline)

## Features

- Create loan applications with automatic monthly repayment calculation
- Fetch loan application details with customer information
- Input validation and error handling
- PostgreSQL integration 
- Secure deployment setup for AWS
- CI/CD pipeline with GitHub Actions

## Technology Stack

- **Node.js & Express.js**: Server 
- **PostgreSQL & Sequelize ORM**: Database and ORM
- **AWS Elastic Beanstalk**: Cloud deployment
- **GitHub Actions**: CI/CD pipeline
- **Jest**: Testing framework
- **Helmet, CORS**

## Local Setup
### Prerequisites
- Node.js (v14+)
- npm 
- PostgreSQL
- AWS Account (for deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/oluwabukolatina/nest-egg.git
   cd nest-egg
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your database credentials and other settings.

4. Start the server:
   ```bash
   npm run dev
   ```

   The API will be available at http://localhost:{{YOUR_PORT}}/v1

### Running Tests

```bash
npm test
```

## Database Schema

### Tables

1. **customers**
    - `id`: Serial, Primary Key
    - `first_name`: VARCHAR(100), Not Null
    - `last_name`: VARCHAR(100), Not Null
    - `email`: VARCHAR(255), Unique, Not Null
    - `created_at`: TIMESTAMP
    - `updated_at`: TIMESTAMP

2. **loan_applications**
    - `id`: Serial, Primary Key
    - `customer_id`: INTEGER, Foreign Key (customers.id)
    - `amount`: DECIMAL(12,2), Not Null
    - `term_months`: INTEGER, Not Null
    - `annual_interest_rate`: DECIMAL(5,2), Not Null
    - `monthly_repayment`: DECIMAL(12,2), Not Null
    - `status`: VARCHAR(20), Default 'PENDING'
    - `created_at`: TIMESTAMP
    - `updated_at`: TIMESTAMP
###
The database schema includes indexes on:
- `customer_id` in the `loan_applications` table for faster joins
- `email` in the `customers` table for faster lookups and to enforce uniqueness
### Indexes
- `idx_customers_email`: On customers(email)
- `idx_loan_applications_customer_id`: On loan_applications(customer_id)
- `idx_loan_applications_status`: On loan_applications(status)

## API Endpoints

### Create Loan Application
- **URL**: `/v1/loan-applications`
- **Method**: POST
- **Body**:
  ```json
  
   {
  "amount": 90000,
  "annual_interest_rate": 4.5,
  "customer_id": 4,
  "term_months": 20
  }
  ```
- **Response**:
  ```json
  {
       "message": "Loan Application Created Successfully",
       "status": true,
       "data": {
              "data": {
                     "created_at": "2025-03-23T00:31:04.946Z",
                     "updated_at": "2025-03-23T00:31:04.946Z",
                     "status": "PENDING",
                     "id": 7,
                     "customer_id": 4,
                     "amount": "90000.00",
                     "term_months": 20,
                     "annual_interest_rate": "4.50",
                     "monthly_payment": "4679.29"
              }
       }
  }
  ```

### Get Loan Application by ID
- **URL**: `/v1/loan-applications/:id`
- **Method**: GET
- **Response**:
  ```json
  {
       "status": true,
       "message": "Fetched One Loan Application",
       "data": {
              "loanApplication": {
                     "id": 7,
                     "customer_id": 4,
                     "amount": "90000.00",
                     "term_months": 20,
                     "annual_interest_rate": "4.50",
                     "monthly_payment": "4679.29",
                     "status": "PENDING",
                     "created_at": "2025-03-23T00:31:04.946Z",
                     "updated_at": "2025-03-23T00:31:04.946Z",
                     "customer": {
                            "id": 4,
                            "first_name": "London",
                            "last_name": "Bridge",
                            "email": "london.bridge@sights.com"
                     }
              }
       }
  }
  ```

## AWS Deployment
The backend is configured for deployment to AWS using Elastic Beanstalk.
## AWS Infrastructure Setup

1. **AWS RDS PostgreSQL Instance**
   - Create a database-specific IAM authentication policy that allows the EC2 instances to connect to the RDS instance.
   - Create a PostgreSQL database instance in AWS RDS 
   - Configure security groups to allow access from the Elastic Beanstalk environment 
   - Create a database and user with appropriate permissions.
2. **AWS Elastic Beanstalk Environment**
   - Create a new Elastic Beanstalk application
   - Create a new environment using the Node.js platform
   - Configure environment variables for database connection etc.
   - Deploy the application using GitHub Actions
3. **Environment Variables**
     - PORT=
     - NODE_ENV= 
     - DATABASE_HOST= 
     - DATABASE_PORT= 
     - DATABASE_NAME= 
     - DATABASE_USER= 
     - DATABASE_PASSWORD=
## Security Considerations
### Input Validation
All API inputs are validated using Joi schemas to ensure data integrity and prevent injection attacks.
### Database Security
- Parameterized queries via Sequelize ORM to prevent SQL injection 
- Database credentials stored as environment variables, not in code 
- SSL connection to RDS in production 
### AWS IAM Configuration
- Custom IAM role for the Elastic Beanstalk environment with least privilege 
- IAM policies for accessing RDS, S3, and other required AWS services 
- Secrets managed through environment variables, not hard-coded

## CI/CD Pipeline
The application includes a GitHub Actions workflow in`.github/workflows/ci-cd.yml` for continuous integration and deployment.

### CI Process
1. **Unit and Integration Tests**
   - Jest tests for business logic and API endpoints
   - Uses a test PostgreSQL database
### CD Process
1. Triggered on pushes to the main branch
2. Build Process
3.Creates a deployment package 
3. Deploys to AWS Elastic Beanstalk 
4. Requires AWS credentials as GitHub Secrets 
5. Deployment to AWS
   - Automatic deployment to Elastic Beanstalk for main branch changes

### Required GitHub Secrets

- `AWS_ACCESS_KEY_ID`: AWS IAM user access key
- `AWS_SECRET_ACCESS_KEY`: AWS IAM user secret key

## AI Usage and Development Challenges

During the development of this project, I used AI tools to assist with the following:

1. **Loan calculation formula implementation**: AI assisted in implementing the monthly repayment calculation formula correctly.

2. **AWS deployment configuration**: AI provided guidance on the proper Elastic Beanstalk configuration and IAM policies.

The main challenges I faced included:

1. **Database design decisions**: Determining the optimal schema design 

2. **Security implementation**: Ensuring all security best practices were followed, especially for handling database connections in AWS.

I made decisions to use Sequelize ORM for better database abstraction and security, and implemented a comprehensive validation middleware to ensure data integrity.
