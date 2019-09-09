import Sequelize, { Model } from 'sequelize';
import { isBefore, parseISO } from 'date-fns';

class Meetup extends Model {
  static init(sequelize) {
    super.init(
      {
        data: Sequelize.DATE,
        titulo: Sequelize.STRING,
        descricao: Sequelize.STRING,
        localizacao: Sequelize.STRING,
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(parseISO(this.data), new Date());
          },
        },
      },
      { sequelize }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id' });
    this.belongsTo(models.File, { foreignKey: 'banner_id' });
  }
}

export default Meetup;
