import { v2 as cloudinary } from "cloudinary";

// function for add product
const addProduct = async (req, res) => {
  try {
    // destructuring the product data from request body
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    // destructuring the product images from request files
    const image1 = req.files?.image1?.[0]; // Check if image1 exists in req.files and assign it, otherwise assign undefined
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    // const image1 = req.files.image1 && req.files.image1[0];
    // const image2 = req.files.image2 && req.files.image2[0];
    // const image3 = req.files.image3 && req.files.image3[0];
    // const image4 = req.files.image4 && req.files.image4[0];

    // Filter out undefined images and create an array of valid images
    const images = [image1, image2, image3, image4].filter(Boolean);

    // Upload images to Cloudinary and get their URLs
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });

        return result.secure_url;
      }),
    );

    console.log(
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    );

    console.log("imagesUrl:", imagesUrl);
    // console.log(image1, image2, image3, image4);
    console.log("images:", images);

    res.json({
      success: true,
      images,
      imagesUrl,
    });
    
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// function for list product
const listProducts = async (req, res) => {};

// function for removing product
const removeProduct = async (req, res) => {};

// function for single product info
const singleProduct = async (req, res) => {};

export { addProduct, listProducts, removeProduct, singleProduct };
