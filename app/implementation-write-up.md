# Implementation Write-up
## Use of AI Tools
In completing this task, I leveraged AI tools to streamline development and ensure best practices were followed. Here's how AI was utilized:
I used AI to help draft the initial project structure and scaffold the core components of the application. This allowed me to quickly establish a well-organized codebase that follows TypeScript and Node.js best practices. For specific implementation details, like the monthly repayment calculation formula, I had AI validate my approach to ensure mathematical accuracy.
When setting up the AWS deployment configuration, I used AI to help generate IAM policy examples that follow the principle of least privilege. This was particularly helpful since AWS IAM has a complex syntax, and I wanted to ensure the policies were both secure and functional.

## Implementation Challenges
The main challenges I faced during implementation included:
1. **Database Schema Design**: Deciding on the appropriate schema structure, field types, and constraints required careful consideration. I needed to ensure the schema was flexible enough for future extensions while maintaining data integrity. I addressed this by implementing clear type definitions and proper validation rules.
2. **Secure AWS Configuration**: Configuring AWS services securely while maintaining ease of deployment was challenging. I implemented a separation of environments (development, testing, production) with appropriate security configurations for each, including SSL connections to RDS in production.
3. **CI/CD Pipeline**: Setting up the GitHub Actions workflow to correctly build, test, and deploy the application required careful configuration and testing. I ensured the pipeline handles dependencies correctly, runs tests against a real PostgreSQL instance, and creates proper deployment packages for Elastic Beanstalk.

## Key Implementation Decisions
1. **TypeScript for Type Safety**: I chose to implement the entire application in TypeScript to benefit from static type checking, which helps prevent common runtime errors and improves code maintainability.
2. **Sequelize ORM for Database Access**: Sequelize provides a clean abstraction over PostgreSQL with built-in security features like parameterized queries to prevent SQL injection.
3. **Middleware-based Architecture**: I implemented middleware for cross-cutting concerns like validation, error handling to maintain clean controller code focused on business logic.
 4. **Secure by Default Approach**: Security was built in from the start with input validation, secure HTTP headers via Helmet.js, and proper environment variable management
5. **Automated Testing**: The CI/CD pipeline includes comprehensive testing to ensure code quality.

Overall, I aimed to create a solution that is not only functional and secure but also maintainable and extensible for future development.
