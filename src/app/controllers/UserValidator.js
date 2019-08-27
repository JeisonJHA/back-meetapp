import * as Yup from 'yup';

import User from '../models/User';

class UserValidator {
  async validateCreate(req, res) {
    const paramSchema = Yup.object().shape({
      name: Yup.string().required('name é um campo requerido'),
      email: Yup.string()
        .email()
        .required('email é um campo requerido'),
      password: Yup.string()
        .required('password é um campo requerido')
        .min(6, 'password deve conter 6 caracteres'),
    });
    const userSchema = Yup.object().oneOf([null]);
    try {
      await paramSchema.validate(req.body, { abortEarly: false });
      const { email } = req.body;
      const userExists = await User.findOne({ where: { email } });
      await userSchema.validate(userExists);
      return true;
    } catch (err) {
      res.status(401).json({ error: err.errors });
      return false;
    }
  }

  async validateUpdate(req, res) {
    const paramSchema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.lazy(() =>
        Yup.string()
          .min(6, 'oldPassword deve conter 6 caracteres')
          .when('password', (password, field) =>
            password
              ? field.required('oldPassword é um campo requerido')
              : field
          )
      ),
      password: Yup.string()
        .min(6, 'password deve conter 6 caracteres')
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required('password é um campo requerido') : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password
          ? field
              .required('confirmPassword é um campo requerido')
              .oneOf(
                [Yup.ref('password')],
                'confirmPassword deve ser identico ao password'
              )
          : field
      ),
    });
    const userSchema = Yup.object().oneOf([null]);
    try {
      await paramSchema.validate(req.body, { abortEarly: false });
      const { email, oldPassword } = req.body;
      const user = await User.findByPk(req.userId);
      if (email !== user.email) {
        await userSchema.validate(user);
      }
      if (!(await user.checkPassword(oldPassword))) {
        res.status(401).json({ error: 'oldPassword inválido.' });
        return false;
      }
      return true;
    } catch (err) {
      res.status(401).json({ error: err.errors });
      return false;
    }
  }
}

export default new UserValidator();
