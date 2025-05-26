import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { t } from 'i18next';

const HomeBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('https://img.icons8.com/ios/50/000000/lightning-bolt.png')] bg-repeat opacity-20"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {t('home.homeBanner.titlePart1')} <br />
              <span className="text-yellow-400">{t('home.homeBanner.titlePart2')}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-blue-100">
              {t('home.homeBanner.description')}
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                variant="contained"
                color="primary"
                size="large"
                className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform"
                onClick={() => navigate('/products')}
              >
                {t('home.homeBanner.shopNow')}
              </Button>
              
              <Button
                variant="outlined"
                color="primary"
                size="large"
                className="border-white text-white hover:bg-white hover:text-blue-900 font-bold py-3 px-6 rounded-lg shadow-lg transition-colors"
                onClick={() => navigate('/about')}
              >
                {t('home.homeBanner.learnMore')}
              </Button>
            </div>
          </div>
          
          <div className="hidden md:block">
            <img 
              src={assets.HomeBanner} 
              alt="Electrical products"
              className="w-full h-auto rounded-lg shadow-2xl transform hover:scale-105 transition-transform"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;