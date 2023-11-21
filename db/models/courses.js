//ADDED ON STEP 4 - CREATE COURSES MODEL
'use strict';
const { Model } = require('sequelize');
//const { Sequelize } = require('..');

module.exports = (sequelize, DataTypes) => {
    class Course extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Course.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.TEXT,
        },
        estimatedTime: {
            type: DataTypes.STRING
        },
        materialsNeeded: {
            type: DataTypes.STRING
        }
    }, {
        sequelize,
        modelName: 'Courses',
    });
    Course.associate = (models) => {
        // TODO Add associations.
        Course.belongsTo(models.User);
    };
    return Course;
};