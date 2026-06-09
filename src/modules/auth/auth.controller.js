const service =
    require('./auth.service');


const register = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await service.register(
                req.body
            );

        res.status(201)
            .json(result);

    } catch (error) {

        next(error);

    }

};

const login = async (
    req,
    res,
    next
) => {

    try {

        const { email, password } =
            req.body;

        const result =
            await service.login(
                email,
                password
            );

        res.json(result);

    } catch (error) {

        next(error);

    }
};

const me = async (
    req,
    res
) => {

    res.json(req.user);

};

module.exports = {
    login,
    me,
    register
};