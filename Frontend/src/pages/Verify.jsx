import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import { useStore } from "../StoreContext";

/**
 * Verify Component
 * 
 * Handles redirection from Stripe Checkout.
 * 1. Reads 'success' and 'orderId' query parameters from URL.
 * 2. Calls backend POST /api/order/verifyStripe with auth token.
 * 3. On success: clears local cart, notifies customer, redirects to /orders.
 * 4. On cancel/fail: notifies customer, redirects back to /cart so items are preserved.
 */
export default function Verify() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { backendUrl, token, setCart } = useStore();
  const [statusMessage, setStatusMessage] = useState("Verifying your payment, please wait...");

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const verifyPayment = async () => {
    // Get token from store or fallback to localStorage
    const authToken = token || localStorage.getItem("token");

    // Guard: Ensure required URL parameters exist
    if (!orderId || success === null) {
      toast.error("Invalid payment verification details");
      navigate("/cart");
      return;
    }

    // Guard: Ensure user is logged in
    if (!authToken) {
      toast.error("Please sign in to verify your order");
      navigate("/login");
      return;
    }

    try {
      setStatusMessage("Confirming payment with Stripe...");

      // Call the backend verifyStripe API
      const response = await axios.post(
        `${backendUrl}/api/order/verifyStripe`,
        { success, orderId },
        { headers: { token: authToken } }
      );

      if (response.data.success) {
        // Clear cart from global state and localStorage
        setCart([]);
        localStorage.removeItem("forever-cart");

        toast.success("Payment completed successfully! Order placed.");
        navigate("/orders");
      } else {
        toast.error(response.data.message || "Payment was cancelled or failed");
        navigate("/cart");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to verify payment");
      navigate("/cart");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [token]);

  return (
    <Layout>
      <div className="page-container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <div className="rounded-2xl border border-line bg-ivory/60 p-10 shadow-[0_8px_24px_rgba(67,54,38,0.035)] sm:p-14">
          {/* Animated Spinner */}
          <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-[#e4d9cc] border-t-[#2d2925]" />
          
          <h1 className="text-lg font-medium text-ink sm:text-xl">
            Processing Payment
          </h1>
          
          <p className="mt-3 max-w-sm text-xs text-muted sm:text-sm">
            {statusMessage}
          </p>
          
          <p className="mt-2 text-[11px] text-[#8c8278]">
            Please do not close or refresh this page.
          </p>
        </div>
      </div>
    </Layout>
  );
}
