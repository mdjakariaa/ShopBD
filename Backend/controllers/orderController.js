import "dotenv/config";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";


// Global variables
// Note: Currency matches the storefront ($ = USD)
const currency = (process.env.CURRENCY || "usd").toLowerCase();
const deliveryCharge = 10;

// Gateway Initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


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

// Placing orders using Stripe Checkout Method
const placeOrderStripe = async (req, res) => {
  try {
    // userId is automatically injected by authUser middleware
    const { userId, items, amount, address } = req.body;

    // Validate that required order information is provided
    if (!items || !items.length) {
      return res.json({ success: false, message: "Cart is empty" });
    }
    if (!address) {
      return res.json({ success: false, message: "Delivery address is required" });
    }

    // Origin URL of the frontend to redirect user after Stripe payment
    const origin = (req.headers.origin || req.get("origin") || "http://localhost:5173").replace(/\/+$/, "");

    // 1. Create and save order in MongoDB with payment status as false
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // 2. Format products into Stripe line items
    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        // Stripe requires amount in cents, rounded to integer
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // 3. Add delivery charge as a separate line item if applicable
    if (deliveryCharge > 0) {
      line_items.push({
        price_data: {
          currency: currency,
          product_data: {
            name: "Delivery Charges",
          },
          unit_amount: Math.round(deliveryCharge * 100),
        },
        quantity: 1,
      });
    }

    // 4. Create Stripe Checkout session with success and cancel redirect URLs
    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    // 5. Send back session URL so frontend can redirect the user
    res.json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    console.error("Error in placeOrderStripe:", error);
    res.json({ success: false, message: error.message });
  }
};

// Verify Stripe Payment
// Called by frontend /verify page when redirected back from Stripe Checkout
const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;

  try {
    // Validate order existence
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    // Security check: ensure order belongs to the authenticated user
    if (order.userId.toString() !== userId.toString()) {
      return res.json({ success: false, message: "Unauthorized access to order" });
    }

    // Check if Stripe payment was successful (supports string "true" or boolean true)
    const isSuccess = success === "true" || success === true;

    if (isSuccess) {
      // 1. Mark order payment as completed
      await orderModel.findByIdAndUpdate(orderId, { payment: true });

      // 2. Clear user cart in MongoDB
      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      // If payment failed or was cancelled, remove the unpaid pending order
      await orderModel.findByIdAndDelete(orderId);

      res.json({ success: false, message: "Payment cancelled or failed" });
    }
  } catch (error) {
    console.error("Error in verifyStripe:", error);
    res.json({ success: false, message: error.message });
  }
};

// Placing orders using Razorpay Method (Placeholder for future gateway integration)
const placeOrderRazorpay = async (req, res) => {};

// All Orders data for Admin Panel, so admin can view all orders in the frontend
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

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
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });

    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, verifyStripe };