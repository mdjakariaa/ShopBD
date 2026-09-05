import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";


//global variables
const currency = "thb";
const deliveryCharge = 10;

// gateway Initialization
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

// Placing orders using Stripe Method (Placeholder for future gateway integration)
const placeOrderStripe = async (req, res) => {
  try {
    // these values are sent from the frontend when the user places an order
    const { userId, items, amount, address } = req.body;
    // here origin means the frontend url from where the request is coming, we will use it to redirect the user after payment
    const { origin } = req.headers;

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

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        // Stripe expects the amount in cents, so we multiply by 100, if item.price is 10, it will be 1000 cents
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    // Adding delivery charges as a separate line item in the Stripe checkout session
    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        // here 100 means dollar to cents conversion, so if deliveryCharge is 10, it will be 1000 cents
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1
    });

    // Create a Stripe checkout session with the order details and redirect URLs, so that after payment, the user can be redirected to the appropriate page
    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({
      success: true,
      session_url: session.url,
    });


  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Verify Stripe
const verifyStripe = async (req, res) => {

    const { orderId, success, userId } = req.body

    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} })

            res.json({ success: true });

        } else {
            await orderModel.findByIdAndDelete(orderId)

            res.json({ success: false })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

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