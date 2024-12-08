import { useEffect, useState } from "react";
import Item from "./Item";

const NewCollections = () => {
  const [newCollection, setNewCollection] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/newcollections")
      .then((response) => response.json())
      .then((data) => setNewCollection(data));
  }, []);

  return (
    <section className='bg-primary'>
      <div className='max_padd_container py-12 xl:py-28 xl:w-[88%]'>
        <h3 className='h3 text-center'>Latest Products</h3>
        <hr className='h-[3px] md:w-1/2 mx-auto bg-gradient-to-l from-transparent via-black to-transparent mb-16' />
        <div className='grid grid-col-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'>
          {newCollection.slice(0, 8).map((item) => {
            const representativeVariant = item.variants[0]; // Select the first variant as the representative
            return (
              <Item
                key={item.id}
                id={item.id}
                image={representativeVariant.image}
                name={item.name}
                new_price={item.new_price}
                old_price={item.old_price}
                color={representativeVariant.color}
                shortDescription={item.shortDescription}
                tags={item.tags}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default NewCollections;