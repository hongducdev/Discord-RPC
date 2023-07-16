import { colors } from "../utils/constants";
import ColorCard from "../components/ColorCard/ColorCard";
import { useSelector } from "react-redux";

const Setting = () => {
  const { colorPrimary } = useSelector((state) => state.color);

  return (
    <div className="w-full bg-ctp-surface0 p-5 rounded-xl">
      <h2 className={`text-3xl font-bold text-${colorPrimary}`}>Setting</h2>
      <div className="w-full h-[2px] bg-ctp-subtext0 my-2 rounded-xl"></div>
      <div className="mt-5">
        <span className="text-xl text-semibold">Color</span>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {colors.map((color) => (
            <ColorCard key={color.id} name={color.name} value={color.value} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Setting;
