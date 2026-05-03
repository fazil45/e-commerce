import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'
import type { ProductType } from '../assets/assets'

type ProductTypes = ProductType[]


const BestSeller = () => {
    const {products} = useContext(ShopContext)
    const [BestSeller, setBestSeller] = useState<ProductTypes>([])

    useEffect(() => {
        const bestProduct = products.filter((item) => (item.bestseller))
        setBestSeller(bestProduct.slice(0,5))
    },[])

  return (
    <div className='my-10'>
        <div className='text-center text-3xl py-8'>
            <Title text1='BEST' text2='SELLERS'/>
            <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>Explore our best-selling styles loved by customers—trending picks you don’t want to miss.</p>
        </div>

        {/* Rendering Products */}
        
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            { BestSeller.map((item,index) => (
                <ProductItem id={item._id} image={item.image} name={item.name} price={item.price} key={index}/>
            )) }
        </div>

    </div>
  )
}

export default BestSeller