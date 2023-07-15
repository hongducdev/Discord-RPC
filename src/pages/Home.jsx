import ListProfile from "../components/ListProfile/ListProfile";
import ProfileCard from "../components/ProfileCard/ProfileCard";
import HomeControl from "../components/HomeControl/HomeControl";

const Home = () => {
  return (
    <div>
      <ListProfile />
      <div className="mt-5 flex gap-5 w-full">
        <HomeControl />
        <ProfileCard />
      </div>
    </div>
  );
};

export default Home;
