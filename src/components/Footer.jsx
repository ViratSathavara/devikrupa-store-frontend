import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const Footer = () => {
    const linkSections = [
        {
            title: "Quick Links",
            links: ["Home", "Products", "Best Sellers", "Contact Us", "About Us"]
        },
        {
            title: "Follow Us",
            links: ["Instagram", "Facebook", "LinkedIn"]
        }
    ];

    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-32">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
                <div className="w-[45%]">
                    <Link to="/">
                        <img className="h-28" src={assets.DEVIKRUPA_ELECTRICALS} alt="Devikrupa Electricals Logo" />
                    </Link>
                    <p className="w-full mt-6">
                        Devikrupa Electricals - Your trusted electrical solutions provider. 
                        We offer top-quality electrical products including fans, lights, motors, 
                        and appliances from leading brands. Our expert technicians also provide 
                        professional repair services for all electrical equipment. Serving customers 
                        with reliability and excellence since 2010.
                    </p>
                </div>
                <div className="flex flex-wrap justify-start max-w-[45%] gap-5">
                    {linkSections.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">{section.title}</h3>
                            <ul className="text-sm space-y-1">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a href="#" className="hover:underline transition">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <p className="py-4 text-center text-sm md:text-base text-gray-500/80">
                Copyright © {new Date().getFullYear()} Devikrupa Electricals. All Rights Reserved.
            </p>
        </div>
    );
};

export default Footer;