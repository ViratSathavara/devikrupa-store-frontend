import React, { useContext, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { assets } from "../assets/assets"
import SearchIcon from '@mui/icons-material/Search';
import LocalGroceryStoreOutlinedIcon from '@mui/icons-material/LocalGroceryStoreOutlined';
import { Button } from "@mui/material";
import NavLinks from "./Navlinks";
import { t } from "i18next";
import { LoginContext } from "../contexts/LoginContext";
import { logoutUser } from "../APIs/LoginAPIs";
import history from "../../history";
import { useCart } from "../contexts/CartContext";

const Navbar = () => {
    const { token, user, setUser, setToken, setRole, setShowUserLogin } = useContext(LoginContext)
    const {
        cart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice
    } = useCart();
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const role = localStorage.getItem('role');

    const handleLogout = async () => {
        try {
            const response = await logoutUser();
            if (response?.status === 200 || !response?.status) {
                setToken(null);
                setUser(null);
                setRole(null);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('role');
                navigate('/');
            }
        } catch (error) {
            console.error("Logout failed:", error);
            setToken(null);
            setUser(null);
            setRole(null);
            localStorage.clear();
            navigate('/');
        }
    };

    const handleLogin = () => {
        setShowUserLogin(true);
        navigate('/login');
    }

    return (
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-nav-background relative transition-all">

            <Link to="/">
                <img className="h-28" src={assets.DEVIKRUPA_ELECTRICALS} alt="dummyLogoColored" />
            </Link>

            <div className="hidden md:flex items-center gap-8">
                <NavLinks />

                {role !== 'admin' && <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
                    <LocalGroceryStoreOutlinedIcon className="text-button" />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-[18px] h-[18px] rounded-full">{totalItems}</button>
                </div>}

                {/* <Button 
                    variant="outlined"
                    onClick={toggleLanguage}
                    size="small"
                    sx={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.3)'
                        }
                    }}
                >
                    {language === 'en' ? 'ગુજરાતી' : 'English'}
                </Button> */}

                {!token ? <Button
                    variant="contained"
                    color="ButtonMuiButton-contained"
                    onClick={() => {
                        handleLogin();
                        setOpen(false)
                        setShowUserLogin(true)
                    }}
                >
                    {t('navbar.login')}
                </Button> :
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-40 h-40 rounded-full border-1 bg-white border-black overflow-hidden focus:outline-none"
                        >
                            <img
                                src={user?.image
                                    ? `http://localhost:5000${user?.image}`
                                    : "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                                }
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </button>

                        {isOpen && (
                            <div className="absolute right-0 mt-2 w-auto text-center bg-white rounded-md shadow-lg py-1 z-50">
                                <Link
                                    to="/profile"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    {t('navbar.profile')}
                                </Link>

                                <div className="px-4 py-2">
                                    <Button
                                        onClick={() => {
                                            handleLogout();
                                            setIsOpen(false);
                                        }}
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        className="ButtonMuiButton-contained"
                                    >
                                        {t('navbar.logout')}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                }
            </div>

            <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="md:hidden">
                <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="21" height="1.5" rx=".75" fill="#426287" />
                    <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
                    <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
                </svg>
            </button>

            {open && (
                <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-center gap-2 px-5 text-sm md:hidden`}>
                    <NavLinks />
                    <div className="h-0.5 my-3 w-screen bg-gray-300"></div>
                    {/* <Button 
                        variant="outlined"
                        onClick={toggleLanguage}
                        size="small"
                        sx={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.3)'
                            }
                        }}
                    >
                        {language === 'en' ? 'ગુજરાતી' : 'English'}
                    </Button> */}
                    {!user ? <Button
                        variant="contained"
                        color="ButtonMuiButton-contained"
                        onClick={() => {
                            handleLogin();
                            setOpen(false)
                            setShowUserLogin(true)
                        }}
                    >
                        {t('navbar.login')}
                    </Button> :
                        <div className="flex flex-col items-center text-center" ref={dropdownRef}>
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="w-40 h-40 rounded-full overflow-hidden focus:outline-none"
                            >
                                <img
                                    src={`http://localhost:5000${user?.image}` || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </button>

                            {!isOpen && (
                                <div className="">
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsOpen(false)}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        {t('navbar.profile')}
                                    </Link>

                                    <div className="px-4 py-2">
                                        <Button
                                            onClick={() => {
                                                handleLogout();
                                                setIsOpen(false);
                                            }}
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            className="ButtonMuiButton-contained"
                                        >
                                            {t('navbar.logout')}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    }
                </div>
            )}
        </nav>
    )
}

export default Navbar