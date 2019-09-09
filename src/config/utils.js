import { setLocale } from 'yup';
import { isBefore, startOfHour, parseISO } from 'date-fns';

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

function sendError(res, errCod, message) {
  res.status(errCod).json({ error: message });
  return false;
}

function pastDate(date) {
  return isBefore(startOfHour(parseISO(date)), new Date());
}

export { notAuthorizedErro, sendError, pastDate };
