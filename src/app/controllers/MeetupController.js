import { Op } from 'sequelize';
import { startOfDay, endOfDay } from 'date-fns';

import MeetupValidator from './MeetupValidator';
import { Meetup, User, File } from '../models';

class MeetupController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const where = {};
    if (req.body.data) {
      const searchDay = req.body.data;
      where.data = {
        [Op.between]: [startOfDay(searchDay), endOfDay(searchDay)],
      };
    }
    const meetups = await Meetup.findAll({
      where,
      order: ['data'],
      attributes: ['id', 'titulo', 'descricao', 'localizacao', 'data'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          attributes: ['id', 'name'],
        },
        {
          model: File,
          attributes: ['id', 'path', 'url'],
        },
      ],
    });
    return res.json(meetups);
  }

  async store(req, res) {
    if (!(await MeetupValidator.validateCreate(req, res))) return false;

    const user_id = req.userId;
    const meetup = await Meetup.create({
      ...req.body,
      user_id,
    });

    return res.json(meetup);
  }

  async update(req, res) {
    if (!(await MeetupValidator.validateUpdate(req, res))) return false;
    const user_id = req.userId;
    const meetup = await Meetup.findOne({
      where: {
        id: req.params.id,
        user_id,
      },
      attributes: ['id', 'titulo', 'descricao', 'localizacao', 'data'],
      include: [
        {
          model: File,
          attributes: ['id', 'name', 'url'],
        },
      ],
    });
    const meet = await meetup.update(req.body);
    return res.json(meet);
  }

  async delete(req, res) {
    if (!(await MeetupValidator.validateDelete(req, res))) return false;
    const meetup = await Meetup.findByPk(req.params.id);
    await meetup.destroy();
    return res.send();
  }
}

export default new MeetupController();
