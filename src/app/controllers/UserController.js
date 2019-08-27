import User from '../models/User';
import UserValidator from './UserValidator';

class UserController {
  async store(req, res) {
    if (!(await UserValidator.validateCreate(req, res))) return false;
    const user = await User.create(req.body);
    return res.json(user);
  }

  async update(req, res) {
    if (!(await UserValidator.validateUpdate(req, res))) return false;
    const user = await User.findByPk(req.userId);
    const { email } = req.body;
    const { id, name } = await user.update(req.body);
    return res.json({ id, name, email });
  }
}

export default new UserController();
