const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Bus = sequelize.define(
    "Bus",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      licenseNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      vehicleNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      vehicleType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: DataTypes.STRING(20),
        defaultValue: "inactive",
      },
    },
    {
      timestamps: true,
      tableName: "Buses", // Explicitly specify table name
    }
  );

  Bus.associate = (models) => {
    Driver.hasMany(models.Schedule, {
      foreignKey: "driverId",
      as: "schedules",
      onDelete: "CASCADE",
    });
  };

  return Driver;
};
