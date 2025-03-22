import db from '../../models';

const LoanApplicationService = {
  create(data: {
    customer_id: number;
    amount: number;
    term_months: number;
    annual_interest_rate: number;
    monthly_payment: number;
  }) {
    return db.LoanApplication.create(data);
  },
  getOne(id: number) {
    return db.LoanApplication.findByPk(id, {
      include: [
        {
          model: db.Customer,
          as: 'customer',
          attributes: ['id', 'first_name', 'last_name', 'email'],
        },
      ],
    });
  },
};
export default LoanApplicationService;
