import express from "express";
import {
  addToCart,
  getUserCart,
  updateCart,
} from "../controllers/cartController.js";
import  authUser  from "../middleware/auth.js";

const cartRouter = express.Router();

cartRouter.post("/get", authUser, getUserCart); //authUser middleware is used to verify the user before allowing access to the getUserCart controller function
//getUserCart controller function is used to get the cart data of the user. It is called when the user wants to view their cart. The authUser middleware is used to verify the user before allowing access to the getUserCart controller function. If the user is not authenticated, they will not be able to access their cart data.
cartRouter.post("/add", authUser, addToCart);
//addToCart controller function is used to add products to the user's cart. It is called when the user wants to add a product to their cart.
cartRouter.post("/update", authUser, updateCart);
//updateCart controller function is used to update the user's cart. It is called when the user wants to update the quantity of a product in their cart or remove a product from their cart.

export default cartRouter;
