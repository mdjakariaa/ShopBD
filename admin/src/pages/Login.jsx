import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Temporary frontend login
    // Replace this later with your real authentication API.
    navigate("/add");
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#f7fcf8]">
      <form
        onSubmit={handleSubmit}
        className="
          w-[440px]
          rounded-[8px]
          bg-white
          px-[40px]
          pb-[30px]
          pt-[28px]
          shadow-[0_3px_8px_rgba(0,0,0,0.16)]
          max-[520px]:mx-5
          max-[520px]:w-full
          max-[520px]:px-6
        "
      >
        <h1 className="mb-[25px] text-[30px] font-bold leading-none text-black">
          Admin Panel
        </h1>

        {/* Email */}
        <div className="mb-[18px]">
          <label
            htmlFor="email"
            className="mb-[10px] block text-[16px] font-medium text-[#333]"
          >
            Email Address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="
              h-[52px]
              w-full
              rounded-[6px]
              border
              border-[#d5d5d5]
              bg-white
              px-[14px]
              text-[16px]
              text-[#333]
              outline-none
              placeholder:text-[#9e9e9e]
              focus:border-[#999]
            "
          />
        </div>

        {/* Password */}
        <div className="mb-[24px]">
          <label
            htmlFor="password"
            className="mb-[10px] block text-[16px] font-medium text-[#333]"
          >
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="
              h-[52px]
              w-full
              rounded-[6px]
              border
              border-[#d5d5d5]
              bg-white
              px-[14px]
              text-[16px]
              text-[#333]
              outline-none
              placeholder:text-[#9e9e9e]
              focus:border-[#999]
            "
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="
            flex
            h-[51px]
            w-full
            items-center
            justify-center
            rounded-[6px]
            bg-black
            text-[17px]
            font-medium
            text-white
            transition-opacity
            hover:opacity-90
          "
        >
          Login
        </button>
      </form>
    </main>
  );
};

export default Login;
