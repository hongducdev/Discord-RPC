import React, { useState } from "react";
import ListProfile from "../components/ListProfile/ListProfile";
import Input from "../components/Inputs/Input";
import Select from "../components/Inputs/Select";
import { timestampTypes } from "../utils/constants";

const Home = () => {
  const [tooltips, setTooltips] = useState(["Tooltip 1", "Tooltip 2"]);
  const [applicationId, setApplicationId] = useState("");
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [payload, setPayload] = useState({
    details: "",
    state: "",
    partySize: "",
    partyMax: "",
    linkLargeImage: "",
    textLargeImage: "",
    linkSmallImage: "",
    textSmallImage: "",
    button1Label: "",
    button1Link: "",
    button2Label: "",
    button2Link: "",
  });

  const handleMouseEnter = (index) => {
    setActiveTooltip(index);
  };

  const handleMouseLeave = () => {
    setActiveTooltip(null);
  };

  return (
    <div>
      <ListProfile />
      <div className="mt-5 flex gap-5 w-full">
        <div className="flex-6 bg-ctp-surface0 p-5 rounded-xl">
          <div className="flex gap-4 items-end">
            <Input
              label="Application ID"
              id="application-id"
              placeholder="Application ID"
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
            />
            <button className="bg-ctp-blue h-12 px-3 rounded-lg text-ctp-base">
              Login
            </button>
          </div>
          <div className="w-full h-[1px] bg-ctp-subtext0 rounded-full my-3"></div>
          <div className="flex flex-col gap-3 max-h-[380px] overflow-x-auto px-2">
            <Input
              label="Details"
              id="details"
              placeholder="Details"
              value={payload.details}
              onChange={(e) =>
                setPayload({ ...payload, details: e.target.value })
              }
            />
            <div className="flex gap-3">
              <div className="flex-6">
                <Input
                  label="State"
                  id="state"
                  placeholder="State"
                  value={payload.state}
                  onChange={(e) =>
                    setPayload({ ...payload, state: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center gap-3 flex-4">
                <Input
                  label="Party size"
                  id="party-size"
                  placeholder="Party size"
                  type="number"
                  value={payload.partySize}
                  onChange={(e) => {
                    if (e.target.value > payload.partyMax) {
                      setPayload({
                        ...payload,
                        partySize: payload.partyMax,
                      });
                    } else {
                      setPayload({
                        ...payload,
                        partySize: e.target.value,
                      });
                    }
                  }}
                />
                <Input
                  label="Party max"
                  id="party-max"
                  placeholder="Party max"
                  type="number"
                  value={payload.partyMax}
                  onChange={(e) => {
                    if (e.target.value < payload.partySize) {
                      setPayload({
                        ...payload,
                        partyMax: payload.partySize,
                      });
                    } else {
                      setPayload({
                        ...payload,
                        partyMax: e.target.value,
                      });
                    }
                  }}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Input
                label="Link large image"
                id="link-large-image"
                placeholder="Link large image"
                value={payload.linkLargeImage}
                onChange={(e) => {
                  setPayload({ ...payload, linkLargeImage: e.target.value });
                }}
              />
              <Input
                label="Text large image"
                id="text-large-image"
                placeholder="Text large image"
                value={payload.textLargeImage}
                onChange={(e) => {
                  setPayload({ ...payload, textLargeImage: e.target.value });
                }}
              />
            </div>
            <div className="flex gap-3">
              <Input
                label="Link small image"
                id="link-small-image"
                placeholder="Link small image"
                value={payload.linkSmallImage}
                onChange={(e) => {
                  setPayload({ ...payload, linkSmallImage: e.target.value });
                }}
              />
              <Input
                label="Text small image"
                id="text-small-image"
                placeholder="Text small image"
                value={payload.textSmallImage}
                onChange={(e) => {
                  setPayload({ ...payload, textSmallImage: e.target.value });
                }}
              />
            </div>
            {/* button 1 */}
            <div className="flex gap-3">
              <Input
                label="Button 1 label"
                id="button-1-label"
                placeholder="Button 1 label"
                value={payload.button1Label}
                onChange={(e) => {
                  setPayload({ ...payload, button1Label: e.target.value });
                }}
              />
              <Input
                label="Button 1 link"
                id="button-1-link"
                placeholder="Button 1 link"
                value={payload.button1Link}
                onChange={(e) => {
                  setPayload({ ...payload, button1Link: e.target.value });
                }}
              />
            </div>
            {/* button 2 */}
            <div className="flex gap-3">
              <Input
                label="Button 2 label"
                id="button-2-label"
                placeholder="Button 2 label"
                value={payload.button2Label}
                onChange={(e) => {
                  setPayload({ ...payload, button2Label: e.target.value });
                }}
              />
              <Input
                label="Button 2 link"
                id="button-2-link"
                placeholder="Button 2 link"
                value={payload.button2Link}
                onChange={(e) => {
                  setPayload({ ...payload, button2Link: e.target.value });
                }}
              />
            </div>
            <div className="flex gap-3">
              <Select
                label="Timestamp type"
                id="button-2-label"
                options={timestampTypes}
              />
              <Input
                label="Custom timestamp"
                id="custom-timestamp"
                type="datetime-local"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-3">
            <button className="bg-ctp-green h-12 px-3 rounded-lg text-ctp-base flex-auto">
              Update
            </button>
            <button className="bg-ctp-red h-12 px-3 rounded-lg text-ctp-base flex-auto">
              Stop
            </button>
          </div>
        </div>
        <div className="flex-4 bg-ctp-surface0 rounded-xl">
          <div className="w-full bg-ctp-flamingo h-[120px] rounded-t-xl"></div>
          <img
            src="https://source.unsplash.com/random"
            alt="Avatar"
            className="w-28 h-28 object-cover rounded-full border-4 border-ctp-surface0 -mt-10 ml-3"
          />
          <div className="bg-gradient-to-br from-ctp-base to-ctp-crust m-3 p-3 rounded-lg flex flex-col">
            <span className="text-2xl font-semibold">PinkDuwc._</span>
            <small className="mt-1">hongduccodedao</small>
            <div className="w-full h-[1px] bg-ctp-subtext0 rounded-full my-3"></div>
            <span className="uppercase font-semibold text-sm">
              PLAYING A GAME
            </span>
            <div className="mt-5 flex gap-8 items-center">
              <div className="relative">
                <img
                  src={
                    payload.linkLargeImage ||
                    "https://source.unsplash.com/random"
                  }
                  alt="big_image"
                  className="w-28 h-28 object-cover rounded-lg cursor-pointer"
                  onMouseEnter={() => handleMouseEnter(0)}
                  onMouseLeave={handleMouseLeave}
                />
                {activeTooltip === 0 && (
                  <div className="absolute bg-ctp-surface0 text-white text-sm py-1 px-2 rounded-lg bottom-full right-0 mb-2 mr-1">
                    {payload.textLargeImage || "Large image"}
                  </div>
                )}

                <img
                  src={
                    payload.linkSmallImage ||
                    "https://source.unsplash.com/random"
                  }
                  alt="small_image"
                  className="w-10 h-10 object-cover rounded-full absolute bottom-0 right-0 -mb-1 -mr-1 border-2 border-ctp-surface0 cursor-pointer"
                  onMouseEnter={() => handleMouseEnter(1)}
                  onMouseLeave={handleMouseLeave}
                />
                {activeTooltip === 1 && (
                  <div className="absolute bg-ctp-surface0 text-white text-sm py-1 px-2 rounded-lg bottom-9 right-0 mb-2 mr-1">
                    {payload.textSmallImage || "Small image"}
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-lg">
                  Visual Studio Code
                </span>
                <span className="text-sm">
                  {payload.details || "Editing in index.js"}
                </span>
                <span className="text-sm">
                  {payload.state || "Workspace: NyanRPC"}{" "}
                  {payload.partySize > 0 &&
                    `(${payload.partySize} of ${payload.partyMax})`}
                </span>
                <span className="text-sm">
                  <span className="">12:00:00</span> elapsed
                </span>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-2">
              <div className="w-full rounded-lg bg-ctp-base py-2 px-3 text-center hover:bg-ctp-mantle cursor-pointer hover:duration-300 hover:ease-in-out">
                {payload.button1Label || "Button 1"}
              </div>
              <div className="w-full rounded-lg bg-ctp-base py-2 px-3 text-center hover:bg-ctp-mantle cursor-pointer hover:duration-300 hover:ease-in-out">
                {payload.button2Label || "Button 2"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
