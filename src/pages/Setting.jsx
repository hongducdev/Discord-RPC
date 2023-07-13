import icons from "../utils/icons";
import useDarkMode from "../hooks/useDarkMode";

const { RiSunLine, RiMoonClearLine } = icons;

const Setting = () => {
  const [darkMode, setDarkMode] = useDarkMode();

  return (
    <div className="w-full bg-ctp-surface0 p-5 rounded-xl">
      <h2 className="text-3xl font-bold text-ctp-flamingo">Setting</h2>
      <div className="w-full h-[2px] bg-ctp-subtext0 my-2 rounded-xl"></div>
      <div className="">
        <span className="text-xl text-semibold">Mode</span>
        <div className="flex items-center gap-2 mt-2">
          <div
            className="inline-flex items-center gap-2 border border-ctp-subtext1 px-4 py-2 rounded-lg cursor-pointer hover:bg-ctp-subtext1 hover:text-ctp-base hover:duration-300 hover:ease-in-out"
            onClick={() => setDarkMode(!darkMode)}
          >
            <RiSunLine className="text-xl" />
            <span>Light mode</span>
          </div>
          <div
            className="inline-flex items-center gap-2 border border-ctp-subtext1 px-4 py-2 rounded-lg cursor-pointer hover:bg-ctp-subtext1 hover:text-ctp-base hover:duration-300 hover:ease-in-out"
            onClick={() => setDarkMode(!darkMode)}
          >
            <RiMoonClearLine className="text-xl" />
            <span>Night mode</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
