import React from 'react'

const Item = ({id,name,image,old_price,new_price}) => {
  return (
    <div>
      <div>
        <Link to={`product/${id}`} ></Link>
      </div>
    </div>
  )
}

export default Item
