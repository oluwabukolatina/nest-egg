import { Request, Response } from 'express';
import CustomerService from '../customer/customer.service';
import { NotFoundError } from '../../exception/not-found.error';
import LoanApplicationHelper from './loan-application.helper';
import ResponseHandler from '../../lib/response-handler';
import LoanApplicationService from './loan-application.service';

class LoanApplicationController {
  public create = async (request: Request, response: Response) => {
    const { customer_id, amount, term_months, annual_interest_rate } =
      request.body;
    const customer = await CustomerService.findById(customer_id);
    if (!customer) throw new NotFoundError('Customer not found');
    const monthlyRepayment = LoanApplicationHelper.calculateMonthlyRepayment(
      parseFloat(amount),
      parseFloat(annual_interest_rate),
      parseInt(term_months),
    );
    ResponseHandler.CreatedResponse(
      response,
      'Loan application created successfully',
    );
    return LoanApplicationService.create({
      customer_id,
      amount,
      term_months,
      annual_interest_rate,
      monthly_payment: monthlyRepayment,
    });
  };
}

export default LoanApplicationController;
