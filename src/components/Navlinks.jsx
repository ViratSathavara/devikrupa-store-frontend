import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'
import { LoginContext } from '../contexts/LoginContext';
// import { useAppContext } from '../contexts/AppContext';

const NavLinks = () => {
    // const { user } = useAppContext();
    const { token, user, role } = useContext(LoginContext)
    const { t } = useTranslation();

    return (
        <>
            {token && role === 'admin' ?
                <Link
                    to="/adminhome"
                    className="text-button font-semibold relative px-2 py-1 transition-all duration-300
                hover:text-button
                before:content-[''] before:absolute before:bottom-0 before:left-0 
                before:w-0 before:h-0.5 before:bg-button before:transition-all before:duration-300
                hover:before:w-full hover:font-bold
                active:scale-95 active:text-button
                aria-[current=page]:text-button aria-[current=page]:before:w-full"
                >
                    {t('navbar.adminhome')}
                </Link>
                : <Link
                    to="/"
                    className="text-button font-semibold relative px-2 py-1 transition-all duration-300
                hover:text-button
                before:content-[''] before:absolute before:bottom-0 before:left-0 
                before:w-0 before:h-0.5 before:bg-button before:transition-all before:duration-300
                hover:before:w-full hover:font-bold
                active:scale-95 active:text-button
                aria-[current=page]:text-button aria-[current=page]:before:w-full"
                >
                    {t('navbar.home')}
                </Link>
            }
            {token && role === 'admin' && (
                <>
                    <Link
                        to="/adminproducts"
                        className="text-button font-semibold relative px-2 py-1 transition-all duration-300
                hover:text-button
                before:content-[''] before:absolute before:bottom-0 before:left-0 
                before:w-0 before:h-0.5 before:bg-button before:transition-all before:duration-300
                hover:before:w-full hover:font-bold
                active:scale-95 active:text-button
                aria-[current=page]:text-button aria-[current=page]:before:w-full"
                    >
                        {t('navbar.products')}
                    </Link>
                    <Link
                        to="/categpories"
                        className="text-button font-semibold relative px-2 py-1 transition-all duration-300
                hover:text-button
                before:content-[''] before:absolute before:bottom-0 before:left-0 
                before:w-0 before:h-0.5 before:bg-button before:transition-all before:duration-300
                hover:before:w-full hover:font-bold
                active:scale-95 active:text-button
                aria-[current=page]:text-button aria-[current=page]:before:w-full"
                    >
                        {t('navbar.categories')}
                    </Link>
                    <Link
                        to="/users"
                        className="text-button font-semibold relative px-2 py-1 transition-all duration-300
                hover:text-button
                before:content-[''] before:absolute before:bottom-0 before:left-0 
                before:w-0 before:h-0.5 before:bg-button before:transition-all before:duration-300
                hover:before:w-full hover:font-bold
                active:scale-95 active:text-button
                aria-[current=page]:text-button aria-[current=page]:before:w-full"
                    >
                        {t('navbar.users')}
                    </Link>
                    <Link
                        to="/orders"
                        className="text-button font-semibold relative px-2 py-1 transition-all duration-300
                hover:text-button
                before:content-[''] before:absolute before:bottom-0 before:left-0 
                before:w-0 before:h-0.5 before:bg-button before:transition-all before:duration-300
                hover:before:w-full hover:font-bold
                active:scale-95 active:text-button
                aria-[current=page]:text-button aria-[current=page]:before:w-full"
                    >
                        {t('navbar.orders')}
                    </Link>
                </>)}
            {role !== 'admin' && (
                <Link
                    to="/products"
                    className="text-button font-semibold relative px-2 py-1 transition-all duration-300
                hover:text-button
                before:content-[''] before:absolute before:bottom-0 before:left-0 
                before:w-0 before:h-0.5 before:bg-button before:transition-all before:duration-300
                hover:before:w-full hover:font-bold
                active:scale-95 active:text-button
                aria-[current=page]:text-button aria-[current=page]:before:w-full"
                >
                    {t('navbar.products')}
                </Link>
            )}
            {role !== 'admin' && (
                <Link
                    to="/services"
                    className="text-button font-semibold relative px-2 py-1 transition-all duration-300
                hover:text-button
                before:content-[''] before:absolute before:bottom-0 before:left-0 
                before:w-0 before:h-0.5 before:bg-button before:transition-all before:duration-300
                hover:before:w-full hover:font-bold
                active:scale-95 active:text-button
                aria-[current=page]:text-button aria-[current=page]:before:w-full"
                >
                    {t('navbar.services')}
                </Link>
            )}
            {role === 'user' &&
                <Link
                    to="/my-orders"
                    className="text-button font-semibold relative px-2 py-1 transition-all duration-300
                    hover:text-button
                    before:content-[''] before:absolute before:bottom-0 before:left-0 
                    before:w-0 before:h-0.5 before:bg-button before:transition-all before:duration-300
                    hover:before:w-full hover:font-bold
                    active:scale-95 active:text-button
                    aria-[current=page]:text-button aria-[current=page]:before:w-full"
                >
                    {t('navbar.myOrders')}
                </Link>
            }
            {role !== 'admin' && (
                <Link
                    to="/about"
                    className="text-button font-semibold relative px-2 py-1 transition-all duration-300
                hover:text-button
                before:content-[''] before:absolute before:bottom-0 before:left-0 
                before:w-0 before:h-0.5 before:bg-button before:transition-all before:duration-300
                hover:before:w-full hover:font-bold
                active:scale-95 active:text-button
                aria-[current=page]:text-button aria-[current=page]:before:w-full"
                >
                    {t('navbar.about')}
                </Link>
            )}
            {role !== 'admin' && (
                <Link
                    to="/contact"
                    className="text-button font-semibold relative px-2 py-1 transition-all duration-300
                hover:text-button
                before:content-[''] before:absolute before:bottom-0 before:left-0 
                before:w-0 before:h-0.5 before:bg-button before:transition-all before:duration-300
                hover:before:w-full hover:font-bold
                active:scale-95 active:text-button
                aria-[current=page]:text-button aria-[current=page]:before:w-full"
                >
                    {t('navbar.contact')}
                </Link>
            )}
        </>
    )
}

export default NavLinks