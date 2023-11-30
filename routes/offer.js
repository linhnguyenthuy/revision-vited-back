const express = require("express");
const router = express.Router();

const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

const Offer = require("../models/Offer");

const isAuthenticated = require("../middlewares/isAuthenticated");

router.post(
  "/offer/publish",
  fileUpload(),
  isAuthenticated,

  async (req, res) => {
    try {
      const picture = req.files.picture;
      // console.log(picture);
      // console.log(req.user);
      const convertToBase64 = (file) => {
        return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
      };
      const transformedPicture = convertToBase64(req.files.picture);
      // console.log(transformedPicture);
      const result = await cloudinary.uploader.upload(transformedPicture);
      // console.log(result);
      const newOffer = new Offer({
        product_name: req.body.title,
        product_description: req.body.description,
        product_price: req.body.price,
        product_details: [
          {
            MARQUE: req.body.brand,
          },
          {
            TAILLE: req.body.size,
          },
          {
            ÉTAT: req.body.condition,
          },
          {
            COULEUR: req.body.color,
          },
          {
            EMPLACEMENT: req.body.city,
          },
        ],
        product_image: result,
        owner: req.user,
      });

      await newOffer.save();
      res.status(200).json({
        product_name: req.body.title,
        product_description: req.body.description,
        product_price: req.body.price,
        product_details: [
          {
            MARQUE: req.body.brand,
          },
          {
            TAILLE: req.body.size,
          },
          {
            ÉTAT: req.body.condition,
          },
          {
            COULEUR: req.body.color,
          },
          {
            EMPLACEMENT: req.body.city,
          },
        ],
        product_image: result,
        owner: req.user,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.get("/offer", async (req, res) => {
  try {
    // const title = req.query.title;
    // console.log("->", title);
    const offert = await Offer.find().populate("owner");

    res.status(200).json(offert);

    // console.log("->", offert);
    // if (req.query.title) {
    //   const regexp = new RegExp(title, "i");
    //   const offer = await Offer.find({
    //     product_name: regexp,
    //   }).select("product_price product_name");
    //   console.log("=>", offer);
    //   res.json(offer);
    // } else if (req.query.title & priceMax) {
    //   const regexp = new RegExp(title, "i");
    //   const offer = await Offer.find({
    //     product_name: regexp,
    //     product_price: { $gte: req.query.priceMax },
    //   }).select("product_price product_name");
    //   console.log("==>", offer);
    //   res.json(offer);
    // }
    // const regexp = new RegExp(title, "i");
    // const offer = await Offer.find({
    //   product_name: regexp,
    //   product_price: { $lte: req.query.priceMin, $gte: req.query.priceMax },
    // }).select("product_price product_name");
    // console.log(offer);
    // res.json(offer);

    // const page = req.query.page;
    // // console.log(page);
    // if (page === "1") {
    //   const offer = await Offer.find()
    //     .skip(0)
    //     .limit(10)
    //     .select("product_price product_name");
    //   res.json(offer);
    // } else if (page === "2") {
    //   const offer = await Offer.find()
    //     .skip(10)
    //     .limit(10)
    //     .select("product_price product_name");
    //   res.json(offer);
    // }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
