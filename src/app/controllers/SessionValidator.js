import * as yup from 'yup';

import { User } from '../models';
import { notAuthorizedErro } from '../../config/utils';

class SessionValidator {
  async validate(req, res) {
    const userSchema = yup.object().notOneOf([null]);
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      await userSchema.validate(user);
      if (!(await user.checkPassword(password))) {
        notAuthorizedErro(res);
        return false;
      }
      return true;
    } catch (e) {
      return res.status(400).json({ error: e.errors });
    }
  }
}

export default new SessionValidator();
