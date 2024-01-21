import React, { useState } from "react";
import signupImg from "../assests/signup.gif";
import { Link, useNavigate } from "react-router-dom";
import uploadImageToCloudinary from "../utils/uploadCloudinary";
import HashLoader from "react-spinners/HashLoader";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../redux/rootSlice.js";

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    photo: "",
    gender: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const { loading } = useSelector((state) => state.root);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInputFileChange = async (e) => {
    const file = e.target.files[0];
    const data = await uploadImageToCloudinary(file);
    setPreviewUrl(data.url);
    setSelectedFile(data.url);
    setFormData({ ...formData, photo: data.url });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    axios
      .post(`${import.meta.env.VITE_APP_BASE_URL}/user/register`, formData)
      .then((res) => {
        if (res.status === 201) {
          toast.success(res.data.msg);
          setTimeout(() => {
            dispatch(setLoading(false));
            navigate("/login");
          }, 1000);
        } else {
          throw new Error("Unexpected response");
        }
      })
      .catch((error) => {
        setTimeout(() => {
          dispatch(setLoading(false));
          toast.error(error.response.data.msg);
        }, 1000);
      });
  };

  return (
    <section className="px-5 xl:px-0">
      <div className="max-w-[1170px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* img box  */}
          <div className="hidden lg:block bg-primaryColor rounded-l-lg">
            <figure className="rounded-l-lg">
              <img src={signupImg} alt="" className="w-full rounded-l-lg" />
            </figure>
          </div>
          {/* signup form */}
          <div className="rounded-l-lg lg:pl-16 py-10">
            <h3 className="text-headingColor text=[22px] leading-9 font-bold mb-10 ">
              Create an <span className="text-primaryColor">account</span>
            </h3>
            <form onSubmit={submitHandler}>
              <div className="mb-5">
                <input
                  type="text"
                  placeholder="Enter your firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor  cursor-pointer"
                  required
                />
              </div>
              <div className="mb-5">
                <input
                  type="text"
                  placeholder="Enter your lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor  cursor-pointer"
                  required
                />
              </div>
              <div className="mb-5">
                <input
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor  cursor-pointer"
                  required
                />
              </div>
              <div className="mb-5">
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor  cursor-pointer"
                  required
                />
              </div>
              <div className="mb-5 flex items-center justify-between">
                <label
                  htmlFor="gender"
                  className="text-headingColor font-bold text-[16px] leading-7"
                >
                  Gender:
                  <select
                    value={formData.gender}
                    onChange={handleInputChange}
                    name="gender"
                    id="gender" 
                    className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                  </select>
                </label>
              </div>

              <div className="mb-5 flex items-center gap-3">
                {selectedFile && (
                  <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center">
                    <img
                      src={previewUrl}
                      alt=""
                      className="w-full rounded-full"
                    />
                  </figure>
                )}
                <div className="relative w-[130px] h-[50px]">
                  <input
                    type="file"
                    name="photo"
                    id="customFile"
                    onChange={handleInputFileChange}
                    accept=".jpg, .png, .jpeg"
                    className="absolute top-8 left- w-full h-full opacity-0 cursor-pointer"
                  />
                  <label
                    htmlFor="customFile"
                    className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
                  >
                    Upload Photo
                  </label>
                </div>
              </div>
              <div className="mt-7">
                <button
                  disabled={loading && true}
                  type="submit"
                  className="w-full bg-primaryColor text-[18px] leading-[30px] rounded-lg px-4 py-3"
                >
                  {loading ? (
                    <HashLoader size={35} color="#ffffff" />
                  ) : (
                    "Register"
                  )}
                </button>
              </div>
              <p className="mt-5 text-textColor text-center">
                Already have an account?
                <Link
                  to="/login"
                  className="text-primaryColor font-medium ml-1"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
