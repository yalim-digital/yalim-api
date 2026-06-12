const service =
    require('./auth.service');


const register = async (
    req,
    res,
    next
) => {

    try {

        const payload = {
            ...req.body,
            photo_identite:
                req.file
                    ? req.file.filename
                    : null
        };

        const result =
            await service.register(
                payload
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


const me = async (req, res, next) => {
  try {
    const user = await service.getMe(req.user.id);

    res.json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
    login,
    me,
    register
};