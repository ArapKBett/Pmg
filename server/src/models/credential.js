// server/src/models/credential.js
module.exports = (sequelize, DataTypes) => {
  const Credential = sequelize.define('Credential', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    service: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT
    },
    url: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true
      }
    },
    category: {
      type: DataTypes.STRING,
      defaultValue: 'other'
    }
  }, {
    timestamps: true,
    paranoid: true
  });

  Credential.associate = (models) => {
    Credential.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Credential;
};
