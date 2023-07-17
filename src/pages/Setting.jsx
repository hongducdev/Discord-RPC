import { useSelector } from "react-redux";
import ModeSelect from "../components/ModeSelect/ModeSelect";
import ColorSelect from "../components/ColorCard/ColorSelect";

const Setting = () => {
  const { colorPrimary } = useSelector((state) => state.color);

  return (
    <div className="w-full bg-ctp-surface0 p-5 rounded-xl">
      <h2 className={`text-3xl font-bold text-${colorPrimary}`}>Setting</h2>
      <div className="w-full h-[2px] bg-ctp-subtext0 my-2 rounded-xl"></div>
      <div className="mt-5 flex flex-col gap-3">
        <ModeSelect />
        <ColorSelect />
      </div>
      
    </div>
  );
};

export default Setting;
