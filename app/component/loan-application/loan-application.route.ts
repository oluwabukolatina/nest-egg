import { Application } from 'express';
import LoanApplicationController from './loan-application.controller';
import { asyncHandler } from '../../middleware/async-handler';
import LoanApplicationValidation from './loan-application.validation';
import { CREATE_LOAN_APPLICATION_URL } from './loan-application.url';

class LoanApplicationRoute {
  public loanApplicationController: LoanApplicationController =
    new LoanApplicationController();

  public routes = (app: Application): void => {
    app
      .route(`${CREATE_LOAN_APPLICATION_URL}`)
      .post(
        asyncHandler(LoanApplicationValidation.validateLoanApplication),
        asyncHandler(this.loanApplicationController.create),
      );
  };
}

export default LoanApplicationRoute;
