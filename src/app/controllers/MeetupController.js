import MeetupValidator from './MeetupValidator';
import { Meetup, User, File } from '../models';

class MeetupController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const meetups = await Meetup.findAll({
      where: { user_id: req.userId },
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
    const user_id = req.userId;
    const meetup = await Meetup.findOne({
      where: {
        id: req.params.id,
        user_id,
      },
    });
    meetup.destroy();
    return res.json();
  }
}

export default new MeetupController();
