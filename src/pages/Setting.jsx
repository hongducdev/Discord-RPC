import { colors } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setColorPrimary } from "../app/color/colorSlice";

const Setting = () => {
  const dispatch = useDispatch();
  const { colorPrimary } = useSelector((state) => state.color);

  const handleChangeColor = (color) => {
    dispatch(setColorPrimary(color));
  };

  return (
    <div className="w-full bg-ctp-surface0 p-5 rounded-xl">
      <h2 className={`text-3xl font-bold text-${colorPrimary}`}>Setting</h2>
      <div className="w-full h-[2px] bg-ctp-subtext0 my-2 rounded-xl"></div>
      <div className="mt-5">
        <span className="text-xl text-semibold">Color</span>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {colors.map((color) => (
            <div
              key={color.id}
              className="inline-flex items-center gap-2 border border-ctp-subtext1 px-4 py-2 rounded-lg cursor-pointer hover:bg-ctp-subtext1 hover:text-ctp-base hover:duration-300 hover:ease-in-out"
              onClick={() => handleChangeColor(color.value)}
            >
              <div className={`w-6 h-6 rounded-full bg-${color.value}`}></div>
              <span>{color.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Setting;
