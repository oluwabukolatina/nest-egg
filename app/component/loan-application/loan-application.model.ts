import { Model, DataTypes, Sequelize } from 'sequelize';
import { CustomerInstance } from '../customer/customer.model';

export interface LoanApplicationAttributes {
  id?: number;
  customer_id: number;
  amount: number;
  term_months: number;
  annual_interest_rate: number;
  monthly_payment: number;
  status?: string;
  created_at?: Date;
  updated_at?: Date;
}
export interface LoanApplicationInstance
  extends Model<LoanApplicationAttributes>,
    LoanApplicationAttributes {
  customer?: CustomerInstance;
}
export default (sequelize: Sequelize) => {
  return sequelize.define<LoanApplicationInstance>(
    'LoanApplication',
    {
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
      },
      amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      term_months: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
      annual_interest_rate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      monthly_payment: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(20),
        defaultValue: 'PENDING',
        validate: {
          isIn: [['PENDING', 'APPROVED', 'REJECTED']],
        },
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'loan_applications',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );
};
