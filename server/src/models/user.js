// server/src/models/user.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 30]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    masterPasswordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    encryptionKey: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    twoFactorSecret: {
      type: DataTypes.STRING
    },
    lastLogin: {
      type: DataTypes.DATE
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    timestamps: true,
    paranoid: true,
    defaultScope: {
      attributes: { exclude: ['masterPasswordHash', 'encryptionKey', 'twoFactorSecret'] }
    },
    scopes: {
      withSecrets: {
        attributes: {}
      }
    }
  });

  User.associate = (models) => {
    User.hasMany(models.Credential, { foreignKey: 'userId' });
    User.hasMany(models.OTP, { foreignKey: 'userId' });
    User.hasMany(models.Device, { foreignKey: 'userId' });
  };

  return User;
};
