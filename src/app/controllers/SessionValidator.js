import * as yup from 'yup';

import { User } from '../models';

class SessionValidator {
  async validate(req, res) {
    const userSchema = yup.object().notOneOf([null]);
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      await userSchema.validate(user);
      if (!(await user.checkPassword(password))) {
        res.status(401).json({ error: 'Login Invalid' });
        return false;
      }
      return true;
    } catch (e) {
      return res.status(401).json({ error: e.errors });
    }
  }
}

export default new SessionValidator();
