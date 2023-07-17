import React, { useEffect, useState } from "react";
import Input from "../Inputs/Input";
import Select from "../Inputs/Select";
import { timestampTypes } from "../../utils/constants";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsLogged,
  setDataInput,
  setShowModalSelectSession,
  setApplication,
} from "../../app/home/homeSlice";

const HomeControl = () => {
  const dispatch = useDispatch();
  const { isLogged } = useSelector((state) => state.home);

  const [applicationId, setApplicationId] = useState("");
  const [payload, setPayload] = useState({
    details: "",
    state: "",
    partySize: "",
    partyMax: "",
    largeImageKey: "",
    largeImageText: "",
    smallImageKey: "",
    smallImageText: "",
    buttons: [
      { label: "", url: "" },
      { label: "", url: "" },
    ],
  });

  useEffect(() => {
    dispatch(setDataInput(payload));
  }, [payload, dispatch]);

  const handleLogin = async () => {

    dispatch(setShowModalSelectSession(true));
    dispatch(setApplication(applicationId));
  };

  const handleLogout = async () => {
    const response = await window.electron.logout();
    if (response.success) {
      toast.success("Logout success");
      setApplicationId("");
      dispatch(setIsLogged(false));
    } else {
      console.log(response);
      toast.error(response.error.message);
    }
  };

  const handleStartRPC = async () => {
    const response = await window.electron.setActivity(payload);
    if (response.success) {
      toast.success("Update RPC success");
    } else {
      console.log(response);
      toast.error(response.error.message);
    }
  };

  const handleClearRPC = async () => {
    const response = await window.electron.clearActivity();
    if (response.success) {
      toast.success("Clear RPC success");
    } else {
      console.log(response);
      toast.error(response.error.message);
    }
  };

  return (
    <div className="flex-6 bg-ctp-surface0 p-5 rounded-xl">
      <div className="flex gap-4 items-end">
        <Input
          label="Application ID"
          id="application-id"
          placeholder="Application ID"
          value={applicationId}
          onChange={(e) => setApplicationId(e.target.value)}
        />
        {isLogged ? (
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
          onChange={(e) => setPayload({ ...payload, details: e.target.value })}
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
            value={payload.largeImageKey}
            onChange={(e) => {
              setPayload({ ...payload, largeImageKey: e.target.value });
            }}
          />
          <Input
            label="Text large image"
            id="text-large-image"
            placeholder="Text large image"
            value={payload.largeImageText}
            onChange={(e) => {
              setPayload({ ...payload, largeImageText: e.target.value });
            }}
          />
        </div>
        <div className="flex gap-3">
          <Input
            label="Link small image"
            id="link-small-image"
            placeholder="Link small image"
            value={payload.smallImageKey}
            onChange={(e) => {
              setPayload({ ...payload, smallImageKey: e.target.value });
            }}
          />
          <Input
            label="Text small image"
            id="text-small-image"
            placeholder="Text small image"
            value={payload.smallImageText}
            onChange={(e) => {
              setPayload({ ...payload, smallImageText: e.target.value });
            }}
          />
        </div>
        {/* button 1 */}
        <div className="flex gap-3">
          <Input
            label="Button 1 label"
            id="button-1-label"
            placeholder="Button 1 label"
            value={payload.buttons[0].label}
            onChange={(e) => {
              const newButtons = [...payload.buttons];
              newButtons[0] = { ...newButtons[0], label: e.target.value };
              setPayload({ ...payload, buttons: newButtons });
            }}
          />
          <Input
            label="Button 1 link"
            id="button-1-link"
            placeholder="Button 1 link"
            value={payload.buttons[0].url}
            onChange={(e) => {
              const newButtons = [...payload.buttons];
              newButtons[0] = { ...newButtons[0], url: e.target.value };
              setPayload({ ...payload, buttons: newButtons });
            }}
          />
        </div>
        {/* button 2 */}
        <div className="flex gap-3">
          <Input
            label="Button 2 label"
            id="button-2-label"
            placeholder="Button 2 label"
            value={payload.buttons[1].label}
            onChange={(e) => {
              const newButtons = [...payload.buttons];
              newButtons[1] = { ...newButtons[1], label: e.target.value };
              setPayload({ ...payload, buttons: newButtons });
            }}
          />
          <Input
            label="Button 2 link"
            id="button-2-link"
            placeholder="Button 2 link"
            value={payload.buttons[1].url}
            onChange={(e) => {
              const newButtons = [...payload.buttons];
              newButtons[1] = { ...newButtons[1], url: e.target.value };
              setPayload({ ...payload, buttons: newButtons });
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
        <button
          className="bg-ctp-green h-12 px-3 rounded-lg text-ctp-base flex-auto"
          onClick={handleStartRPC}
        >
          Update
        </button>
        <button
          className="bg-ctp-red h-12 px-3 rounded-lg text-ctp-base flex-auto"
          onClick={handleClearRPC}
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default HomeControl;
