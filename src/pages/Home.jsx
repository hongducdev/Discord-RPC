import React, { useEffect, useState } from "react";
import ListProfile from "../components/ListProfile/ListProfile";
import Input from "../components/Inputs/Input";
import Select from "../components/Inputs/Select";
import { timestampTypes } from "../utils/constants";
import ProfileCard from "../components/ProfileCard/ProfileCard";
import { toast } from "react-toastify";

const Home = () => {
  const [applicationId, setApplicationId] = useState("");
  const [isLogin, setIsLogin] = useState(false);
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

  const handleLogin = async () => {
    const response = await window.electron.login(applicationId);
    if (response.success) {
      toast.success("Login success");
      setIsLogin(true);
    } else {
      console.log(response);
      toast.error(response.error.message);
    }
  };

  const handleLogout = async () => {
    const response = await window.electron.logout();
    if (response.success) {
      toast.success("Logout success");
      setIsLogin(false);
      setApplicationId("");
    } else {
      console.log(response);
      toast.error(response.error.message);
    }
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
            {isLogin ? (
              <button
                className="bg-ctp-blue h-12 px-3 rounded-lg text-ctp-base"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <button
                className="bg-ctp-blue h-12 px-3 rounded-lg text-ctp-base"
                onClick={handleLogin}
              >
                Login
              </button>
            )}
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
        <ProfileCard payload={payload} />
      </div>
    </div>
  );
};

export default Home;
