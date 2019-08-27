import { setLocale } from 'yup';

setLocale({
  mixed: {
    oneOf: 'Usuário já existe',
  },
  string: {
    email: 'email deve conter um email válido',
  },
});

function notAuthorizedErro(res) {
  return res.status(401).json({ error: 'Not authorized' });
}
async function validateSchema(req, schema) {
  const isValid = await schema.isValid(req.body);
  if (isValid) {
    return true;
  }
  const err = new Error('Validations fails');
  err.code = 401;
  throw err;
}

export { notAuthorizedErro, validateSchema };
