//ADDED ON STEP 4 - CREATE USER MODEL
'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');


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
        // id: {
        //     type: DataTypes.INTEGER,
        //     primaryKey: true,
        //     autoIncrement: true,
        // },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'The email you entered already exists',
            },
            validate: {
                notNull: {
                    msg: 'An email is required',
                },
                isEmail: {
                    msg: 'Please provide a valid email address',
                },
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'You cannot have an empty password'
                }
            },
            set(val) {
                const hashedPassword = bcrypt.hashSync(val, 10);
                this.setDataValue('password', hashedPassword);
            }
        },
    }, { sequelize });
    User.associate = (models) => {
        // TODO Add associations.
        User.hasMany(models.Course, {
            // as: 'userId',
            foreignKey: {
                fieldName: 'userId',
                allowNull: false,
            }
        });
    };
    return User;
};