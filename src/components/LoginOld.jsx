import { useState, useContext, useRef } from "react";
import { LoginContext } from "../contexts/LoginContext.jsx";
import { loginUser, registerUser, verifyOTP } from "../APIs/LoginAPIs.jsx";
import { useNavigate } from "react-router-dom";
import OTPVerification from "./OTPVerification.jsx";

const Login = ({ setShowUserLogin }) => {
    const { role, handleAuthSuccess } = useContext(LoginContext);
    const navigate = useNavigate();
    const [mode, setMode] = useState("login");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [otpStep, setOtpStep] = useState(false);
    const [registrationData, setRegistrationData] = useState(null);
    const fileInputRef = useRef(null);
    const [error, setError] = useState("");
    
    const submitHandler = async (e) => {
        e.preventDefault();
        setError("");
        
        if (mode === "login") {
            try {
                const formData = new FormData();
                formData.append('email', email);
                formData.append('password', password);
                const formDataObj = {};
                for (let [key, value] of formData.entries()) {
                    formDataObj[key] = value;
                }
                
                const result = await loginUser(formDataObj);
                
                if (result?.status === 200) {
                    handleAuthSuccess(result?.data?.token, result?.data?.user);
                    setShowUserLogin(false);
                    if (role === "admin") {
                        navigate('/admin/dashboard');
                    }
                }
            } catch (error) {
                setError(error.response?.data?.message || "Login failed");
            }
        } else {
            try {
                const formData = new FormData();
                formData.append('firstname', firstName);
                formData.append('lastname', lastName);
                formData.append('email', email);
                formData.append('phone', phone);
                formData.append('password', password);

                if (fileInputRef.current?.files[0]) {
                    formData.append('image', fileInputRef.current.files[0]);
                }

                const formDataObj = {};
                for (let [key, value] of formData.entries()) {
                    formDataObj[key] = value;
                }
                
                // First step: initiate registration and send OTP
                const result = await registerUser(formDataObj);
                
                if (result?.status === 200) {
                    setRegistrationData(formDataObj);
                    setOtpStep(true);
                } else {
                    setError(result?.error || "Registration failed");
                }
            } catch (error) {
                setError(error.response?.data?.message || "Registration failed");
            }
        }
    };

    const handleOTPVerification = async (otpData) => {
        try {
            const verifyResult = await verifyOTP({
                email,
                otp: otpData.otp
            });

            if (verifyResult?.status === 200) {
                handleAuthSuccess(verifyResult?.data?.token, verifyResult?.data?.user);
                setShowUserLogin(false);
                if (role === "admin") {
                    navigate('/admin/dashboard');
                }
            }
        } catch (error) {
            setError(error.response?.data?.message || "OTP verification failed");
        }
    };

    if (otpStep) {
        return (
            <OTPVerification
                email={email}
                onVerifySuccess={handleOTPVerification}
                onBack={() => setOtpStep(false)}
            />
        );
    }

    return (
        <div
            className="fixed inset-0 flex items-center justify-center overflow-auto max-h-screen bg-black/60 z-30"
            onClick={() => setShowUserLogin(false)}
        >
            <form
                onSubmit={submitHandler}
                onClick={e => e.stopPropagation()}
                className="flex flex-col gap-4 p-8 w-80 sm:w-[352px] bg-white rounded shadow-xl"
            >
                <h2 className="m-auto text-20 font-medium">
                    <span className="text-indigo-500">User</span> {mode === "login" ? "Login" : "Sign Up"}
                </h2>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                {mode === "register" && (
                    <>
                        <label>FirstName</label>
                        <input
                            type="text"
                            required
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            className="border rounded p-2 outline-indigo-500"
                            placeholder="FirstName"
                        />
                    </>
                )}

                {mode === "register" && (
                    <>
                        <label>LastName</label>
                        <input
                            type="text"
                            required
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            className="border rounded p-2 outline-indigo-500"
                            placeholder="LastName"
                        />
                    </>
                )}
                <label>Email</label>
                <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="border rounded p-2 outline-indigo-500"
                    placeholder="Email"
                />

                {mode === "register" && (
                    <>
                        <label>Phone No.</label>
                        <input
                            type="number"
                            required
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            className="border rounded p-2 outline-indigo-500"
                            placeholder="Phone No."
                        />
                    </>
                )}
                {mode === "register" && (
                    <>
                        <label>Image</label>
                        <input
                            type="file"
                            required
                            ref={fileInputRef}
                            className="border rounded p-2 outline-indigo-500"
                            accept="image/*"
                        />
                    </>
                )}

                <label>Password</label>
                <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="border rounded p-2 outline-indigo-500"
                    placeholder="Password"
                />

                <p className="text-sm">
                    {mode === "login"
                        ? <>New? <span onClick={() => setMode("register")} className="text-indigo-500 cursor-pointer">Sign up</span></>
                        : <>Have an account? <span onClick={() => setMode("login")} className="text-indigo-500 cursor-pointer">Login</span></>
                    }
                </p>

                <button
                    type="submit"
                    className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded transition"
                >
                    {mode === "login" ? "Login" : "Create Account"}
                </button>
            </form>
        </div>
    );
};

export default Login;