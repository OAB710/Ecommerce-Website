import { MdOutlineLocalOffer, MdStar } from "react-icons/md";
import { NavLink } from "react-router-dom";

const Hero = () => {
  return (
    <section>
        <div>
            <h1>Digital Shopping Hub Junction</h1>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus magni ullam fugiat, placeat aspernatur a hic nulla exercitationem consequuntur incidunt necessitatibus delectus distinctio sint laudantium? Facere animi ea enim tenetur inventore excepturi dolorem.</p>
            <div>
                <div>
                    <MdStar />
                    <MdStar />
                    <MdStar />
                    <MdStar />
                </div>
            <div className="bold-16 sm:bold-20">200k <span className="regular-16 sm:regular-20">Excellent Reviews</span>
            </div>
            <div className="max-xs:flex-col flex gap-2">
                <NavLink to={""} className={"btn_dark_rounded flexCenter"}>Shop now</NavLink>
                <NavLink to={""} className={"btn_dark_rounded flexCenter"}><MdOutlineLocalOffer className="text-2x1"/>Offers</NavLink>
            </div>        
            </div>
        </div>
    </section>
  )
}

export default Hero