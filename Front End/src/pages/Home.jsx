import Hero from "../components/Hero";
import Popular from "../components/Popular";
import Offer from "../components/Offer";
import NewCollections from "../components/NewCollections";
import NewCollectionsMen from "../components/NewCollectionsMen";
import NewCollectionsWomen from "../components/NewCollectionsWomen";
import NewCollectionsKids from "../components/NewCollectionsKids";
import NewsLetter from "../components/NewsLetter";

const Home = () => {
  return (
    <>
      <Hero />
      {/* <Popular /> */}
      <Offer />
      <NewCollections />
      <NewCollectionsMen />
      <NewCollectionsWomen />
      <NewCollectionsKids />
      <NewsLetter />
    </>
  );
};

export default Home;