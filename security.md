# Security

This document outlines the security practices implemented in the Loan Application API.

## Table of Contents

- [Input Validation](#input-validation)
- [Database Security](#database-security)
- [API Security](#api-security)
- [Environment Variables and Secrets Management](#environment-variables-and-secrets-management)

## Input Validation
All API inputs are validated using the Joi validation library to prevent injection attacks and ensure data integrity.
### **Implementation**
```async validateLoanApplication(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const schema = Joi.object({
      customer_id: Joi.number().integer().positive().required().messages({
        'number.base': 'Customer ID must be a number',
        'number.integer': 'Customer ID must be an integer',
        'number.positive': 'Customer ID must be a positive number',
      }),
      amount: Joi.number().positive().required().messages({
        'number.base': 'Loan amount must be a number',
        'number.positive': 'Loan amount must be a positive number',
      }),

      term_months: Joi.number().integer().min(1).required().messages({
        'number.base': 'Term months must be a number',
        'number.integer': 'Term months must be an integer',
        'number.min': 'Term months must be at least 1',
      }),
      annual_interest_rate: Joi.number().min(0).max(100).default(5.0).messages({
        'number.base': 'Annual interest rate must be a number',
        'number.min': 'Annual interest rate cannot be negative',
        'number.max': 'Annual interest rate cannot exceed 100%',
      }),
    });
    return AppValidation.bodyBaseValidator(schema, request, response, next);
  },
  ```
## Database Security
The application uses several layers of database security to protect sensitive data:
### SQL Injection Prevention
- **Parameterized Queries**: All database queries use Sequelize ORM, which automatically uses parameterized queries 
- **Input Validation**: All user inputs are validated before being used in database operations 

### Database Connection Security
- **SSL Encryption**: Production RDS connections use SSL/TLS encryption
  
#### **Example Sequelize Configuration for SSL:**
```
dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }
```

## API Security
### HTTP Security Headers
The application uses Helmet.js to set secure HTTP headers:
```
this.app.use(helmet());
```
This includes:
- Content-Security-Policy
- Strict-Transport-Security 
- X-Content-Type-Options 
- X-Frame-Options 
- X-XSS-Protection

## Environment Variables and Secrets Management
All sensitive information is managed through environment variables, not hardcoded:
- Database credentials
### 1. Elastic Beanstalk Environment

- **Platform**: Node.js
- **Instance Type**: t3.small (can be adjusted based on load)
- **Auto Scaling**: Enabled with min=1, max=4 instances
- **Load Balancer**: Application Load Balancer (ALB)

### 2. RDS PostgreSQL

- **Instance Type**: db.t3.small
- **Storage**: 20GB gp2 (General Purpose SSD)
- **Multi-AZ**: Enabled for production
- **Backup**: Daily automated backups with 7-day retention
- **PostgreSQL Version**: 14

### 3. CloudWatch

- **Metrics**: CPU, Memory, and Disk usage
- **Alarms**: Set up for high CPU utilization (>80% for 5 minutes)
- **Logs**: Application logs and RDS logs

## Security Configuration

### IAM Roles and Policies

#### Elastic Beanstalk Instance Profile

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cloudwatch:PutMetricData",
        "ec2:DescribeInstanceStatus",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:DescribeLogStreams",
        "logs:DescribeLogGroups",
        "logs:CreateLogGroup"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "rds:DescribeDBInstances",
        "rds-db:connect"
      ],
      "Resource": "arn:aws:rds:{region}:{account-id}:db:loan-application-db"
    }
  ]
}
```

#### CI/CD Deployment Role

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "elasticbeanstalk:CreateApplicationVersion",
        "elasticbeanstalk:UpdateEnvironment",
        "elasticbeanstalk:DescribeEnvironments",
        "elasticbeanstalk:DescribeApplicationVersions",
        "elasticbeanstalk:DescribeEvents"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::elasticbeanstalk-{region}-{account-id}",
        "arn:aws:s3:::elasticbeanstalk-{region}-{account-id}/*"
      ]
    }
  ]
}
```

### RDS Security

1. **Network Security**:
    - RDS instance placed in a private subnet
    - Security Group only allows connections from Elastic Beanstalk Security Group

2. **Encryption**:
    - Data at rest: Enabled with AWS KMS
    - Data in transit: SSL/TLS connection enforced

3. **Authentication**:
    - Strong password policy
    - IAM database authentication for additional security

### Secrets Management

1. **Environment Variables**:
    - Sensitive information stored as Elastic Beanstalk environment properties
    - Credentials not stored in code repository

2. **GitHub Secrets**:
    - AWS access keys stored as GitHub repository secrets for CI/CD

## Deployment Process

### Initial Setup

1. **Create RDS Instance**:
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier loan-application-db \
     --engine postgres \
     --db-instance-class db.t3.small \
     --allocated-storage 20 \
     --master-username admin \
     --master-user-password <secure-password> \
     --vpc-security-group-ids <security-group-id> \
     --db-subnet-group-name <subnet-group> \
     --backup-retention-period 7 \
     --storage-encrypted \
     --multi-az
   ```

2. **Create Elastic Beanstalk Application**:
   ```bash
   aws elasticbeanstalk create-application \
     --application-name loan-application-api \
     --description "Loan Application API"
   ```

3. **Create Elastic Beanstalk Environment**:
   ```bash
   aws elasticbeanstalk create-environment \
     --application-name loan-application-api \
     --environment-name loan-application-api-prod \
     --solution-stack-name "64bit Amazon Linux 2 v5.8.0 running Node.js 18" \
     --option-settings file://eb-options.json
   ```

   Example eb-options.json:
   ```json
   [
     {
       "Namespace": "aws:autoscaling:launchconfiguration",
       "OptionName": "IamInstanceProfile",
       "Value": "loan-application-instance-profile"
     },
     {
       "Namespace": "aws:elasticbeanstalk:application:environment",
       "OptionName": "NODE_ENV",
       "Value": "production"
     },
     {
       "Namespace": "aws:elasticbeanstalk:application:environment",
       "OptionName": "DB_HOST",
       "Value": "loan-application-db.xxxxxxxxxx.region.rds.amazonaws.com"
     }
   ]
   ```

### Ongoing Deployments

The GitHub Actions workflow handles deployments to Elastic Beanstalk whenever changes are pushed to the main branch:

1. Code is tested and linted
2. A deployment package is created
3. The package is deployed to Elastic Beanstalk
4. Deployment status is monitored

## Monitoring and Logging

1. **CloudWatch Dashboards**:
    - Custom dashboard for application and database metrics

2. **Log Groups**:
    - `/aws/elasticbeanstalk/loan-application-api-prod/var/log/nodejs/nodejs.log`
    - `/aws/rds/instance/loan-application-db/postgresql`

3. **Alarms**:
    - CPU Utilization > 80% for 5 minutes
    - Memory Utilization > 80% for 5 minutes
    - Error Rate > 5% for 5 minutes

## Disaster Recovery

1. **RDS Automated Backups**:
    - Daily backups with 7-day retention
    - Ability to restore to any point in time within retention period

2. **Application Version Management**:
    - Previous application versions retained in Elastic Beanstalk
    - Quick rollback capability

3. **Multi-AZ Deployment**:
    - RDS configured for Multi-AZ for high availability
    - Automatic failover in case of primary instance failure
