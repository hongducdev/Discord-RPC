import icons from "./icons";
import { paths } from "./paths";

const { RiHome6Line, RiSettingsLine, RiCodeLine } = icons;

export const menu = [
  {
    id: 1,
    label: "Home",
    icon: <RiHome6Line />,
    path: paths.HOME,
  },
  {
    id: 2,
    label: "About",
    icon: <RiCodeLine />,
    path: paths.ABOUT,
  },
  {
    id: 3,
    label: "Settings",
    icon: <RiSettingsLine />,
    path: paths.SETTINGS,
  },
];

export const timestampTypes = [
  {
    id: 1,
    name: "None",
    value: "none",
  },
  {
    id: 2,
    name: "Since NyanRPC started",
    value: "since",
  },
  {
    id: 3,
    name: "Since last presence update",
    value: "last",
  },
  {
    id: 4,
    name: "Your local time",
    value: "local",
  },
  {
    id: 5,
    name: "Custom",
    value: "custom",
  },
];
