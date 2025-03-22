import { Sequelize } from 'sequelize';
import LoanApplicationModel from '../component/loan-application/loan-application.model';
import CustomerModel from '../component/customer/customer.model';
import * as secret from '../config/secrets';

const config = require('../sequelize-config.js')[
  String(secret.ENVIRONMENT)
];

interface DB {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
  Customer: ReturnType<typeof CustomerModel>;
  LoanApplication: ReturnType<typeof LoanApplicationModel>;
  [key: string]: any;
}

const db: DB = {} as DB;

let sequelize: Sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable]!, config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

// Initialize models
db.Customer = CustomerModel(sequelize);
db.LoanApplication = LoanApplicationModel(sequelize);

// Define associations
db.Customer.hasMany(db.LoanApplication, {
  foreignKey: 'customer_id',
  as: 'loan_applications',
});

db.LoanApplication.belongsTo(db.Customer, {
  foreignKey: 'customer_id',
  as: 'customer',
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
