// server/src/models/otp.js
module.exports = (sequelize, DataTypes) => {
  const OTP = sequelize.define('OTP', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    service: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('totp', 'hotp', 'sms', 'email'),
      defaultValue: 'totp'
    }
  }, {
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        fields: ['expiresAt'],
        where: { deletedAt: null }
      }
    ]
  });

  OTP.associate = (models) => {
    OTP.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return OTP;
};
