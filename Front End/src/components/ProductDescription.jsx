import React from 'react'

const ProductDescription = () => {
  return (
    <div className='mt-20'>
      <div className='flex gap-3 mb-4'>
        <button className='btn_dark_rounded !rounded-none !text-xs !py-[6px] w-36'>Description</button>
        <button className='btn_dark_outline !rounded-none !text-xs !py-[6px] w-36'>Care Guide</button>
        <button className='btn_dark_outline !rounded-none !text-xs !py-[6px] w-36'>Size Guide</button>
      </div>
      <div className='flex flex-col pb-16'>
        <p className='text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo molestiae maiores porro modi pariatur odio facilis fuga itaque sequi cupiditate ipsam, consequuntur enim ad exercitationem distinctio tempora sint nihil rem.</p>
        <p className='text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo molestiae maiores porro modi pariatur odio facilis fuga itaque sequi cupiditate ipsam, consequuntur enim ad exercitationem distinctio tempora sint nihil rem.</p>
      </div>
    </div>
  )
}

export default ProductDescription
