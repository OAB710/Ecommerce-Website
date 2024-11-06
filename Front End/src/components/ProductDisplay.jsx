import product_rt_1 from "../assets/product_rt_1.png"
import product_rt_2 from "../assets/product_rt_2.png"
import product_rt_3 from "../assets/product_rt_3.png"
import product_rt_4 from "../assets/product_rt_4.png"

const ProductDisplay = (props) => {
    const product=props;
  return (
    <section>
        <div>
            <div>
                <img src={product_rt_1} alt="productImg" className='max-h-[99px]' />
                <img src={product_rt_2} alt="productImg" className='max-h-[99px]' />
                <img src={product_rt_3} alt="productImg" className='max-h-[99px]' />
                <img src={product_rt_4} alt="productImg" className='max-h-[99px]' />
            </div>
            <div>
                <img src={product.image} alt="" />
            </div>
        </div>
    </section>
  )
}

export default ProductDisplay
