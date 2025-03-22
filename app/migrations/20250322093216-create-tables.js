const { DataTypes } = require('sequelize');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Create customers table
    await queryInterface.createTable('customers', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });

    // Add index on customer email
    await queryInterface.addIndex('customers', ['email'], {
      name: 'idx_customers_email',
    });

    // Create loan_applications table
    await queryInterface.createTable('loan_applications', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'customers',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      term_months: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      annual_interest_rate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      monthly_payment: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(20),
        defaultValue: 'PENDING',
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });

    // Add indexes
    await queryInterface.addIndex('loan_applications', ['customer_id'], {
      name: 'idx_loan_applications_customer_id',
    });

    await queryInterface.addIndex('loan_applications', ['status'], {
      name: 'idx_loan_applications_status',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('loan_applications');
    await queryInterface.dropTable('customers');
  },
};
