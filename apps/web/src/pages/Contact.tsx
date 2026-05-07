import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1='CONTACT' text2='US'/>
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img src={assets.contact_img} className='w-full md:max-w-[4080px' alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-semibold text-gray-600'>Our Story</p>
          <p>54709 poice station <br /> suit 359, Washingtop USA</p>
          <p className='text-gray-500'>54709 Williams Stable br Suit 350 </p>
          <p className='text-gray-500'>54709 Williams Stable br Suit 350 </p>
          <p className= 'font-semibold text-xl text-gray-500'>Carrers at Forever</p>
          <button className='border border-black px-8 py-4 text-sm  hover:bg-black hover:text-ahote' >Explore Jobs</button>
        </div>
      </div>
    </div>
  )
}

export default Contact