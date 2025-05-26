import React, { useContext } from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from 'axios';
import { assets } from '../assets/assets';
import { useState } from 'react';
import { useEffect } from 'react';
import { getCategories } from '../APIs/CategoryAPIs';
import { t } from 'i18next';
import { CategoryContext } from '../contexts/CategoryContext';

const Categories = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { category, setCategory } = useContext(CategoryContext);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategory(response);
      } catch (error) {
        console.error('Full error:', error);
      }
    };
    fetchCategories();
  }, []);


  const handleCategoryClick = (category) => {
    if (category.hasSubcategories) {
      navigate(`/categories/${category._id}`);
    } else {
      navigate(`/products?category=${category._id}`);
    }
  };

  const sliderSettings = {
    infinite: true,
    autoplay: true,
    autoplaySpeed: 1500,
    dots: false,
    arrows: false,
    speed: 700,
    slidesToShow: 6,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      }
    ]
  };

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

  return (
    <div className="p-4 bg-white">
      <h1 className="text-20 font-bold mb-6 text-center">
        {t('home.categories.title')}
      </h1>

      <Slider {...sliderSettings}>
        {Array.isArray(category?.data) && category?.count > 0 && category?.data?.map((category) => (
          <div
            key={category.categoryId}
            // onClick={() => handleCategoryClick(category)}
            className="px-2 cursor-pointer w-200 h-200"
          >
            <div
              className="p-4 rounded-lg shadow-md hover:shadow-lg h-full transition-shadow"
              style={{
                backgroundColor: `rgba(${hexToRgb(category?.bgColor)}, 0.3)`,
              }}
            >
              <img
                src={`http://localhost:5000${category.categoryImage}`}
                alt={t(`${category.headingEng}`)}
                className="w-120 min-h-120 rounde-full bg- h-auto bg-white rounded-full p-1 hover:w-124  transition-all duration-150 object-contain mx-auto mb-3"
              />
              <h2 className="text-lg font-semibold  text-center">
                {category.categoryName}
              </h2>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Categories;
