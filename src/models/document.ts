import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

class Document extends Model {
  public id!: string;
  public name!: string;
  public type!: 'PDF' | 'TXT' | 'XDOC';
  public description!: string;
}

Document.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: ()=> uuidv4(),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(48),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('PDF', 'TXT', 'XDOC'),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'documents',
  }
);

export default Document;
