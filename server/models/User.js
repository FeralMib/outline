// @flow
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import uuid from 'uuid';
import JWT from 'jsonwebtoken';
import { DataTypes, sequelize, encryptedFields } from '../sequelize';
import { publicS3Endpoint, uploadToS3FromUrl } from '../utils/s3';
import { sendEmail } from '../mailer';

const BCRYPT_COST = process.env.NODE_ENV !== 'production' ? 4 : 12;

const User = sequelize.define(
  'user',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: { type: DataTypes.STRING },
    username: { type: DataTypes.STRING },
    name: DataTypes.STRING,
    avatarUrl: { type: DataTypes.STRING, allowNull: true },
    password: DataTypes.VIRTUAL,
    passwordDigest: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    slackAccessToken: encryptedFields.vault('slackAccessToken'),
    service: { type: DataTypes.STRING, allowNull: true, unique: true },
    serviceId: { type: DataTypes.STRING, allowNull: true, unique: true },
    slackData: DataTypes.JSONB,
    jwtSecret: encryptedFields.vault('jwtSecret'),
    suspendedAt: DataTypes.DATE,
    suspendedById: DataTypes.UUID,
  },
  {
    getterMethods: {
      isSuspended() {
        return !!this.suspendedAt;
      },
    },
    indexes: [
      {
        fields: ['email'],
      },
    ],
  }
);

// Class methods
User.associate = models => {
  User.hasMany(models.ApiKey, { as: 'apiKeys' });
  User.hasMany(models.Document, { as: 'documents' });
  User.hasMany(models.View, { as: 'views' });
};

// Instance methods
User.prototype.getJwtToken = function() {
  return JWT.sign({ id: this.id }, this.jwtSecret);
};

User.prototype.verifyPassword = function(password) {
  return new Promise((resolve, reject) => {
    if (!this.passwordDigest) {
      resolve(false);
      return;
    }

    bcrypt.compare(password, this.passwordDigest, (err, ok) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(ok);
    });
  });
};

const uploadAvatar = async model => {
  const endpoint = publicS3Endpoint();

  if (model.avatarUrl && !model.avatarUrl.startsWith(endpoint)) {
    const newUrl = await uploadToS3FromUrl(
      model.avatarUrl,
      `avatars/${model.id}/${uuid.v4()}`
    );
    if (newUrl) model.avatarUrl = newUrl;
  }
};

const setRandomJwtSecret = model => {
  model.jwtSecret = crypto.randomBytes(64).toString('hex');
};
const hashPassword = model => {
  if (!model.password) {
    return null;
  }

  return new Promise((resolve, reject) => {
    bcrypt.hash(model.password, BCRYPT_COST, (err, digest) => {
      if (err) {
        reject(err);
        return;
      }

      model.passwordDigest = digest;
      resolve();
    });
  });
};
User.beforeCreate(hashPassword);
User.beforeUpdate(hashPassword);
User.beforeSave(uploadAvatar);
User.beforeCreate(setRandomJwtSecret);
User.afterCreate(user => sendEmail('welcome', user.email));

export default User;
