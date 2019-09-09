import * as Yup from 'yup';

import { sendError, pastDate, notAuthorizedErro } from '../../config/utils';
import { Meetup, File } from '../models';

class MeetupValidator {
  async validate(res, object) {
    const schema = Yup.object().shape({
      banner_id: Yup.string().required(),
      titulo: Yup.string().required(),
      descricao: Yup.string().required(),
      data: Yup.date().required(),
      localizacao: Yup.string().required(),
    });
    try {
      await schema.validate(object);
      return true;
    } catch (err) {
      res.status(400).json({ error: err.errors });
      return false;
    }
  }

  async validateCreate(req, res) {
    if (!(await this.validate(res, req.body))) return false;
    const { data } = req.body;
    if (pastDate(data)) {
      res
        .status(400)
        .json({ error: 'Data tem que ser posterior a data atual' });
      return false;
    }
    return true;
  }

  async validateUpdate(req, res) {
    if (!(await this.validate(res, req.body))) return false;
    const user_id = req.userId;
    const meetup = await Meetup.findOne({
      where: {
        id: req.params.id,
        user_id,
      },
    });
    if (!meetup) return notAuthorizedErro(res);
    if (meetup.past) return sendError(res, 400, 'Meetup has past.');
    if (pastDate(req.body.data))
      return sendError(res, 400, 'Only future dates are allowed.');
    const { banner_id } = req.body;
    const banner = await File.findOne({ where: { id: banner_id } });
    if (!banner) return sendError(res, 400, 'Banner doesn`t exists.');
    return true;
  }

  async validateDelete(req, res) {
    const user_id = req.userId;
    const meetup = await Meetup.findOne({
      where: {
        id: req.params.id,
        user_id,
      },
    });
    if (!meetup) return notAuthorizedErro(res);
    if (pastDate(meetup.data))
      return sendError(res, 400, 'Meetup can`t be cancelled.');
    return true;
  }
}

export default new MeetupValidator();
