import { useDispatch } from "react-redux";
import icons from "../../utils/icons";
import { setMode } from "../../app/color/colorSlice";

const { RiSunLine, RiMoonClearLine } = icons;

const ModeSelect = () => {
  const dispatch = useDispatch();

  return (
    <div className="">
      <span className="text-xl text-semibold">Mode</span>
      <div className="flex items-center gap-2 mt-2">
        <div
          className="inline-flex items-center gap-2 border border-ctp-subtext1 px-4 py-2 rounded-lg cursor-pointer hover:bg-ctp-subtext1 hover:text-ctp-base hover:duration-300 hover:ease-in-out"
          onClick={() => {
            dispatch(setMode("light"));
          }}
        >
          <RiSunLine className="text-xl" />
          <span>Light mode</span>
        </div>
        <div
          className="inline-flex items-center gap-2 border border-ctp-subtext1 px-4 py-2 rounded-lg cursor-pointer hover:bg-ctp-subtext1 hover:text-ctp-base hover:duration-300 hover:ease-in-out"
          onClick={() => {
            dispatch(setMode("dark"));
          }}
        >
          <RiMoonClearLine className="text-xl" />
          <span>Night mode</span>
        </div>
      </div>
    </div>
  );
};

export default ModeSelect;
