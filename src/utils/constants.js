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

export const colors = [
  {
    id: 1,
    name: "Rosewater",
    value: "ctp-rosewater",
  },
  {
    id: 2,
    name: "Flamingo",
    value: "ctp-flamingo",
  },
  {
    id: 3,
    name: "Pink",
    value: "ctp-pink",
  },
  {
    id: 4,
    name: "Mauve",
    value: "ctp-mauve",
  },
  {
    id: 5,
    name: "Lavender",
    value: "ctp-lavender",
  },
  {
    id: 6,
    name: "Red",
    value: "ctp-red",
  },
  {
    id: 7,
    name: "Maroon",
    value: "ctp-maroon",
  },
  {
    id: 8,
    name: "Peach",
    value: "ctp-peach",
  },
  {
    id: 9,
    name: "Yellow",
    value: "ctp-yellow",
  },
  {
    id: 10,
    name: "Green",
    value: "ctp-green",
  },
  {
    id: 11,
    name: "Teal",
    value: "ctp-teal",
  },
  {
    id: 12,
    name: "Blue",
    value: "ctp-blue",
  },
  {
    id: 13,
    name: "Sky",
    value: "ctp-sky",
  },
  {
    id: 14,
    name: "Sapphire",
    value: "ctp-sapphire",
  },
];
