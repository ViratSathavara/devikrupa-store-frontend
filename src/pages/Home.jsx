import React from 'react'
import HomeBanner from '../components/HomeBanner'
import Categories from '../components/Categories'
import BestSellers from '../components/BestSellers'

const Home = () => {
  return (
    <div>
      <div className='px-8 pt-8'>
      <HomeBanner />
      </div>
      <div className='px-8 pt-8'>
      <Categories />
      </div>
      <div className='px-8 pt-8'>
      <BestSellers />
      </div>
      <div className='px-8 pt-8'>
      <HomeBanner />
      </div>
    </div>
  )
}

export default Home