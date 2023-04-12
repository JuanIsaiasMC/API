const {
  saveFileToFirebase,
} = require("../firebase/functions/saveFileToFirebase");
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");
const { User, Track, Genre } = require("../models/initModels");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

const uploadTrack = catchAsync(async (req, res, next) => {
  try {
    const { originalname } = req.files.audio[0];
    const { user_id, price, genres } = JSON.parse(req.body.trackData);

    const uuid = uuidv4();

    const [audioResponse, imageResponse, user, genresToAdd] = await Promise.all(
      [
        saveFileToFirebase({ uuid, ...req.files.audio[0] }),
        req.files.image
          ? saveFileToFirebase({ uuid, ...req.files.image[0] })
          : undefined,
        User.findByPk(user_id),
        Genre.findAll({
          where: {
            name: {
              [Op.in]: Array.isArray(genres) ? genres : [],
            },
          },
        }),
      ]
    );

    const track = await Track.create({
      id: uuid,
      title: originalname.slice(0, -4),
      download_url: audioResponse,
      image_url: imageResponse,
      price,
    });

    await Promise.all([user.addTrack(track), track.addGenres(genresToAdd)]);

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.log(error);
  }
});

const getTracks = catchAsync(async (req, res, next) => {
  try {
    const { page, search, sortBy, sortDirection, genres = [] } = req.query;

    const pageSize = 10;

    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    const filter = search
      ? {
          title: {
            [Op.iLike]: `%${search}%`,
          },
        }
      : {};

    let order = [["createdAt", sortDirection || "DESC"]];
    if (sortBy === "price") {
      order = [[sortBy, sortDirection || "ASC"]];
    } else if (sortBy === "title") {
      order = [[sortBy, sortDirection || "ASC"]];
    }

    const tracks = await Track.findAll({
      where: filter,
      include: [
        {
          model: Genre,
          as: "genres",
          attributes: ["name"],
          where:
            genres.length > 0 && Array.isArray(genres)
              ? {
                  name: {
                    [Op.in]: genres,
                  },
                }
              : {},
        },
      ],
      offset,
      limit,
      order,
    });

    const count = await Track.findAndCountAll({
      where: filter,
      distinct: true,
      include: [
        {
          model: Genre,
          as: "genres",
          attributes: ["name"],
          where:
            genres.length > 0 && Array.isArray(genres)
              ? {
                  name: {
                    [Op.in]: genres,
                  },
                }
              : {},
        },
      ],
    });

    const totalTracks = count.count;
    const totalPages = Math.ceil(totalTracks / pageSize);
    const remainingPages = totalPages - page;

    res.status(200).json({
      status: "success",
      data: {
        tracks,
        pagination: {
          pageSize,
          page,
          remainingPages,
          totalPages,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
});

const uploadTracksTest = catchAsync(async (req, res, next) => {
  try {
    const { tracksData, user_id } = req.body;

    const user = await User.findByPk(user_id);
    if (!user) throw new Error("User not found");

    // Crear las pistas y asociarlas al usuario
    const createdTracks = await Promise.all(
      tracksData.map(async (trackData) => {
        const { title, price, genres } = trackData;

        const track = await Track.create({
          title: title.slice(0, -4),
          download_url:
            "https://storage.googleapis.com/soundscaleapp-15d98.appspot.com/audios/041322b4-ccef-4de0-9b58-7eb8fc025aedsmoke-143172.mp3?GoogleAccessId=firebase-adminsdk-dmobp%40soundscaleapp-15d98.iam.gserviceaccount.com&Expires=4102455600&Signature=Hp9WsuYgLale5tIEFRGDO2Uyv4PYp5Tw02Ra951k0AjPza9EO8LdQUDP0D%2FI6hat8X%2FmzVW3g1lMwZvl0obj87AjrYcsAb86S9u1JrAauP6sGWd3Mshm%2FiWp%2BRSe4vA0RDBDoT%2F4Rg4GRtludNA293L4mUAO8FsmHdtAPTXOxVNRCtyvuESvwxMeoyZYp3h3%2BEQ1BdGosDER7%2FhLm%2BEu5wTYbm0Taudi6yUBmce497mTDC0X8eQBxFGvfLS6s4iHqPtP7KBz1z8c57xrfFbAqb4WtsguBYqy3EQ3uw%2FyYmJxjPxkmt9NXKiEuE%2FSgIvyj3KRX7MQ0V23V72IPFqL2Q%3D%3D",
          image_url:
            "https://storage.googleapis.com/soundscaleapp-15d98.appspot.com/images/041322b4-ccef-4de0-9b58-7eb8fc025aedimagenSmokeMusic.jpg?GoogleAccessId=firebase-adminsdk-dmobp%40soundscaleapp-15d98.iam.gserviceaccount.com&Expires=4102455600&Signature=W26vXvBZGbBFlwRQsf0g7%2Bm5RXlOWfsuUPUEdmIiD0r01KjyASmiTiUEoO2jGzra0JXa5okss6OK3TThfdlGuQxE4hg7z2W0nWHI7gwCZaYbLbKr%2Bv6yGguIbMxbDK2h0M1UQBAdLeakk%2BTq%2Fif2VoK0SXfUFY%2F3dxXeGyqpy%2FM8WUyVaP3xMr95qiBlL3ecMO3faUhL9RyC28%2F0HUTsediXRa3FSQ2ruGV44BYj8scLTiwPkzB%2B42PGPERRmlrU1brYGVITMv8ZramJcPfamF0xumH6ahXQFWPHdGhK6gKiCfL1YAg9xYm3ujXtcs1Tth7yylnQozuc5SRG12YGwg%3D%3D",
          price,
        });

        const genresToAdd = await Genre.findAll({
          where: {
            name: {
              [Op.in]: Array.isArray(genres) ? genres : [],
            },
          },
        });

        await Promise.all([user.addTrack(track), track.addGenres(genresToAdd)]);

        return track;
      })
    );

    res.status(200).json({
      status: "success",
      data: {
        tracks: createdTracks,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = { uploadTrack, getTracks, uploadTracksTest };
