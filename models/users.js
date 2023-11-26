//ADDED ON STEP 4 - CREATE USER MODEL
'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

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
        },
        lastName: {
            type: DataTypes.STRING,
        },
        emailAddress: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING,
            // set(val) {
            //     if (val === this.password) {
            //         const hashedPassword = bcrypt.hashSync(this.password, salt);
            //         this.setDataValue('password', hashedPassword);
            //     }
            // },
            // allowNull: false,
            // validate: {
            //     notNull: {
            //         msg: 'You cannot have an empty password'
            //     }
            // }

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