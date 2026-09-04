import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Placing orders using Cash On Delivery (COD) Method
const placeOrder = async (req, res) => {
  try {
    // userId is automatically added to req.body by the authUser middleware
    const { userId, items, amount, address } = req.body;

    // Validate that required order information is provided
    if (!items || !items.length) {
      return res.json({ success: false, message: "Cart is empty" });
    }
    if (!address) {
      return res.json({ success: false, message: "Delivery address is required" });
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: req.body.paymentMethod || "COD",
      payment: false,
      date: Date.now(),
    };

    // Save new order in the database
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Clear the user's cart in the database after successful order placement
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.error("Error in placeOrder:", error);
    res.json({ success: false, message: error.message });
  }
};

// Placing orders using Stripe Method (Placeholder for future gateway integration)
const placeOrderStripe = async (req, res) => {};

// Placing orders using Razorpay Method (Placeholder for future gateway integration)
const placeOrderRazorpay = async (req, res) => {};

// All Orders data for Admin Panel
const allOrders = async (req, res) => {};

// Fetch user orders so customer can view their order history in the frontend
const userOrders = async (req, res) => {
  try {
    // Get userId from req.body (or req.userId) set by authUser middleware
    const userId = req.body.userId || req.userId;

    // Retrieve all orders for this user, sorted by newest first
    const orders = await orderModel.find({ userId }).sort({ date: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error in userOrders:", error);
    res.json({ success: false, message: error.message });
  }
};

// update order status from Admin Panel
const updateStatus = async (req, res) => {};

export { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus };