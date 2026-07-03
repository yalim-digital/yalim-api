const service =
    require('./auth.service');
const uploadToCloudinary =
    require('../../utils/uploadToCloudinary');


const cloudinary =
  require("../../config/cloudinary");

  const getPublicIdFromUrl = (url) => {

const path = url.split("/upload/")[1].replace(/^v\d+\//, "");

    return path;
};

const updateProfilePhoto =
  async (req, res, next) => {

    try {

      const userId =
        req.body.id;
      const user =
        await service.getMe(
          userId
        );

      if (!req.file) {
        return res.status(400)
          .json({
            message:
              "Aucune image envoyée"
          });
      }

      if (
        user.photo_identite
      ) {

        await cloudinary
          .uploader
          .destroy(
                getPublicIdFromUrl(
                    user.photo_identite
                )
          );
      }

      const uploaded =
        await uploadToCloudinary(
          req.file.buffer,
          "members"
        );

   
      const result =
        await service.updatePhoto(
          userId,
          {
            photo_identite:
              uploaded.secure_url
          }
        );

      res.json({
        success: true,
        data: result
      });

    } catch (error) {

      next(error);

    }

};

const updatePassword =
  async (req, res, next) => {

    try {

      const userId =
        req.body.id;
      const user =
        await service.getMe(
          userId
        );
        
      if (!req.body.mot_de_passe) {
        return res.status(400)
          .json({
            message:
              "Aucune mot_de_passe envoyée"
          });
      }


   
      const result =
        await service.updatePassword(
          userId,req.body.mot_de_passe
        );

      res.json({
        success: true,
        data: result
      });

    } catch (error) {

      next(error);

    }

};

const register = async (
    req,
    res,
    next
) => {

    try {

        let photoIdentite = null;

        if (req.file) {

            const uploaded =
                await uploadToCloudinary(
                    req.file.buffer,
                    'members'
                );

            photoIdentite =
                uploaded.secure_url;
        }

            const payload = {

                ...req.body,

                photo_identite:
                    photoIdentite

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
    register,
    updateProfilePhoto,
    updatePassword
};