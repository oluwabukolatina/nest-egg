import { DataTypes, Model, Sequelize } from 'sequelize';
import { LoanApplicationInstance } from '../loan-application/loan-application.model';

export interface CustomerAttributes {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CustomerInstance
  extends Model<CustomerAttributes>,
    CustomerAttributes {
  loan_applications?: LoanApplicationInstance[];
}

export default (sequelize: Sequelize) => {
  return sequelize.define<CustomerInstance>(
    'Customer',
    {
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
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
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
      tableName: 'customers',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );
};
