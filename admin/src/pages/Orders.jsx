import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl, currency } from "../App.jsx";
import { assets } from "../assets/assets.js";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } },
      );

      if (response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    const status = event.target.value;
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        {
          orderId,
          status,
        },
        {
          headers: { token },
        },
      );

      if (response.data.success) {
        toast.success(response.data.message || "Status updated successfully");
        await fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div>
      <h3 className="mb-4 text-base font-semibold text-gray-800">Order Page</h3>

      {loading && !orders.length ? (
        <div className="py-16 text-center text-sm text-gray-500">
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="my-6 rounded-lg border-2 border-dashed border-gray-300 py-16 text-center text-gray-500">
          <p className="text-base font-medium">No orders found</p>
          <p className="mt-1 text-xs text-gray-400">
            Orders placed by customers will appear here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order, index) => (
            <div
              className="grid grid-cols-1 items-start gap-4 rounded border-2 border-gray-200 bg-white p-5 text-xs text-gray-700 shadow-sm sm:grid-cols-[0.5fr_2fr_1fr] sm:text-sm lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr]"
              key={order._id || index}
            >
              <img className="h-12 w-12 object-contain" src={assets.parcel_icon} alt="Parcel" />

              <div>
                <div className="mb-2">
                  {order.items?.map((item, itemIndex) => (
                    <p className="py-0.5" key={itemIndex}>
                      {item.name} x {item.quantity}
                      {item.size ? (
                        <span className="font-medium text-gray-600"> ({item.size})</span>
                      ) : null}
                      {itemIndex < order.items.length - 1 ? "," : ""}
                    </p>
                  ))}
                </div>

                <p className="mt-3 font-semibold text-gray-900">
                  {`${order.address?.firstName || ""} ${order.address?.lastName || ""}`.trim() ||
                    "Customer"}
                </p>

                <div className="text-gray-600">
                  {order.address?.street && <p>{order.address.street},</p>}
                  <p>
                    {[
                      order.address?.city,
                      order.address?.state,
                      order.address?.country,
                      order.address?.zipCode || order.address?.zip,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>

                {order.address?.phone && (
                  <p className="mt-1 text-gray-600">{order.address.phone}</p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium sm:text-[15px]">
                  Items: {order.items?.length || 0}
                </p>
                <p className="mt-3 text-gray-600">Method: {order.paymentMethod}</p>
                <p className="text-gray-600">
                  Payment:{" "}
                  <span
                    className={
                      order.payment
                        ? "font-medium text-green-600"
                        : "font-medium text-amber-600"
                    }
                  >
                    {order.payment ? "Done" : "Pending"}
                  </span>
                </p>
                <p className="text-gray-600">
                  Date: {order.date ? new Date(order.date).toLocaleDateString() : "N/A"}
                </p>
              </div>

              <p className="text-sm font-semibold text-gray-800 sm:text-[15px]">
                {currency}
                {order.amount}
              </p>

              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
                className="cursor-pointer rounded border border-gray-300 bg-white p-2 font-medium text-gray-700 outline-none transition-colors hover:border-gray-400 focus:border-black"
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

