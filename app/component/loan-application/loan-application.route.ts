import LoanApplicationController from './loan-application.controller';
import { Application } from 'express';
import {
  CREATE_LOAN_APPLICATION_URL,
  FIND_LOAN_APPLICATION_URL,
} from './loan-application.url';
import { asyncHandler } from '../../middleware/async-handler';
import LoanApplicationValidation from './loan-application.validation';

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
    app
      .route(`${FIND_LOAN_APPLICATION_URL}`)
      .get(
        asyncHandler(LoanApplicationValidation.validateFindLoanApplication),
        asyncHandler(this.loanApplicationController.getOne),
      );
  };
}

export default LoanApplicationRoute;
