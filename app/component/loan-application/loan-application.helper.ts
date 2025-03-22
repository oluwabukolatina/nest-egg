const LoanApplicationHelper = {
  /**
   * Formula: M = (P * r * (1 + r)^n) / ((1 + r)^n - 1)
   *
   * Where:
   * M = Monthly repayment amount
   * P = Loan amount
   * r = Monthly interest rate (annual_interest_rate / 12 / 100)
   * n = Number of months (loan term)
   * @param {number} loanAmount  = Loan amount
   * @param {number} annualInterestRate - Annual interest rate (percentage) Monthly interest rate (annual_interest_rate / 12 / 100)
   * @param {number} loanTerm - Loan term in months
   * @returns {number} Monthly repayment amount
   *
   */
  calculateMonthlyRepayment(
    loanAmount: number,
    annualInterestRate: number,
    loanTerm: number,
  ) {
    const monthlyInterestRate = annualInterestRate / 12 / 100;
    if (monthlyInterestRate === 0) {
      return loanAmount / loanTerm;
    }
    const numerator =
      loanAmount *
      monthlyInterestRate *
      Math.pow(1 + monthlyInterestRate, loanTerm);
    const denominator = Math.pow(1 + monthlyInterestRate, loanTerm) - 1;
    const monthlyPayment = numerator / denominator;
    return Math.round(monthlyPayment * 100) / 100;
  },
};

export default LoanApplicationHelper;
