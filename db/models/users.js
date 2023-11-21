//ADDED ON STEP 4 - CREATE USER MODEL
'use strict';
const { Model } = require('sequelize');
const { Sequelize } = require('..');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: DataTypes.STRING,
        },
        lastName: {
            type: DataTypes.STRING,
        },
        emailAddress: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        }
    }, {
        sequelize,
        modelName: 'Users',
    });
    User.associate = (models) => {
        // TODO Add associations.
        User.hasMany(models.Course);
    };
    return User;
};