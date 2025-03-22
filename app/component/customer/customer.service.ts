import db from '../../models';

const CustomerService = {
  findById(id: number) {
    return db.Customer.findByPk(id);
  },
};
export default CustomerService;
