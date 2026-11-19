const Post = require("../models/post.model");
const image = require("../utils/image");

async function createPost(req, res) {
    const { title, content, path } = req.body ?? {};

    if (!title || !content || !path) {
        image.removeFile(req.file);
        return res.status(400).send({ msg: "El título, el contenido y la ruta del post son obligatorios" });
    }

    const post = new Post({
        title,
        content,
        path,
    });

    // multer deja el archivo en req.file cuando se usa upload.single(...)
    if (req.file) {
        post.miniature = image.getFilePath(req.file);
    }

    try {
        const postStored = await post.save();
        return res.status(200).send(postStored);
    } catch (error) {
        // Si no se pudo guardar el post, la miniatura subida queda huérfana
        image.removeFile(req.file);
        // 11000 = clave duplicada: ya existe un post con ese path (unique)
        if (error.code === 11000) {
            return res.status(400).send({ msg: "Ya existe un post con esa ruta" });
        }
        return res.status(400).send({ msg: "Error al crear el post" });
    }
}

const getPosts = async (req, res) => {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);

    const options = {
        page,
        limit,
        sort: { createdAt: -1 },
    };

    try {
        const posts = await Post.paginate({}, options);
        return res.status(200).send(posts);
    } catch (error) {
        return res.status(500).send({ msg: "Error al obtener los posts" });
    }
};
module.exports = {
    createPost,
    getPosts,
}