const { Sequelize, Model, DataTypes } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:root@localhost:5432/prime');

const Employee = sequelize.define('employees',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        firstName: DataTypes.TEXT,
        lastName: DataTypes.TEXT,
        salary: DataTypes.INTEGER,
    },
    {
        timestamps: true,
    }
);

const getAll = async function () {
    const employees = await Employee.findAll();
    return JSON.stringify(employees, null, 1);
};

const insert = async function (employee) {
    const result = await Employee.create(employee);
    return result;
};

const update = async function (params) {
    const result = await Employee.update(
        {
            firstName: params.data.firstName,
            lastName: params.data.lastName,
            salary: params.data.salary,
        },
        {
            where: {
                id: params.id
            }
        }
    );
    return result;
};

const remove = async function (employeeId) {
    const result = await Employee.destroy({
        where: {
            id: employeeId,
        },
    });
    return result;
};

module.exports = { insert, remove, update, getAll };

/*(async () => {
    await sequelize.sync({ force: true });
})();*/

/*async function connectDb() {
    try {
        await sequelize.authenticate();
        console.log('Conectado com sucesso.');
    } catch (error) {
        console.error('Infelizmente não foi possível. :( - ', error);
    }
}
connectDb();*/

/*async function drop() {
    await User.drop();
    console.log('User table dropped!');
};
drop();*/