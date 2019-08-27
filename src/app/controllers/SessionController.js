import jwt from 'jsonwebtoken';

import User from '../models/User';
import authConfig from '../../config/auth';
import SessionValidator from './SessionValidator';

class SessionController {
  async store(req, res) {
    if (!(await SessionValidator.validate(req, res))) return false;
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    const { id, name } = user;
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
