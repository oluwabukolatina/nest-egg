import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import AppValidation from '../../middleware/app.validation';

const LoanApplicationValidation = {
  async validateLoanApplication(
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
};
export default LoanApplicationValidation;
