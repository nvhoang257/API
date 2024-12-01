const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/'); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
});


const upload = multer({ storage: storage });


const express = require('express');
const router = express.Router();


router.post('/upload', [upload.single('image')], async (req, res, next) => {
    try {
        const { file } = req;
        if (!file) {
            return res.json({ status: 0, link: "" });
        } else {
            const url = `http://localhost:3000/images/${file.filename}`;
            return res.json({ status: 1, url: url });
        }
    } catch (error) {
        console.log('Upload image error: ', error);
        return res.json({ status: 0, link: "" });
    }
});


router.post('/uploads', [upload.array('image', 9)], async (req, res, next) => {
    try {
        const { files } = req;
        if (!files) {
            return res.json({ status: 0, link: [] });
        } else {
            const url = files.map(file => `http://localhost:3000/images/${file.filename}`);
            return res.json({ status: 1, url: url });
        }
    } catch (error) {
        console.log('Upload image error: ', error);
        return res.json({ status: 0, link: [] });
    }
});

module.exports = router; 
