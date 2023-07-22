import React, { useEffect, useState } from "react";
import icons from "../../utils/icons";
import { useDispatch, useSelector } from "react-redux";
import { setShowModalSelectSession } from "../../app/home/homeSlice";
import { toast } from "react-toastify";

const { RiCloseFill } = icons;

const SelectSessionId = () => {
  const [sessionIds, setSessionIds] = useState([]);
  const [applicationId, setApplicationId] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const dispatch = useDispatch();
  const { colorPrimary } = useSelector((state) => state.color);

  useEffect(() => {
    const getApplicationId = async () => {
      const response = await window.RPCStorage.get("applicationId");
      if (response.success) {
        setApplicationId(response.value);
      }
    };
    getApplicationId();
  }, []);

  useEffect(() => {
    const getSessions = async () => {
      const response = await window.electron.getOpenSockets();
      if (response.success) {
        setSessionIds(response.ports);
      }
    };
    getSessions();
  }, []);

  // Sửa lỗi không lưu sessionId vào local storage
  useEffect(() => {
    const setSessionIdLocal = async () => {
      if (selectedSessionId !== null) {
        await window.RPCStorage.set("sessionId", selectedSessionId);
      }
    };

    setSessionIdLocal();
  }, [selectedSessionId]);

  const handleSelectSession = async (sessionId) => {
    setSelectedSessionId(sessionId);
  };

  const handleLogin = async () => {
    const response = await window.electron.login(
      selectedSessionId,
      applicationId
    );
    if (response.success) {
      toast.success("Login success");
      await window.RPCStorage.set("isLogged", true);
      await window.RPCStorage.set("currentUser", response);
      dispatch(setShowModalSelectSession(false));
    } else {
      toast.error(response.error.message);
    }
  };

  return (
    <div>
      <div className="max-w-[500px] bg-ctp-surface0 p-3 rounded-lg">
        <div className="flex items-center justify-between mb-5">
          <p className="select-none">Select session to connect</p>
          <div
            className="p-2 hover:text-ctp-red text-2xl text-ctp-text cursor-pointer inline-block"
            onClick={() => dispatch(setShowModalSelectSession(false))}
          >
            <RiCloseFill />
          </div>
        </div>
        {sessionIds?.map((sessionId, index) => (
          <div
            key={index}
            className={
              selectedSessionId === sessionId
                ? `bg-ctp-base text-ctp-text p-2 rounded-md mb-2 border-2 border-${colorPrimary} cursor-pointer`
                : `bg-ctp-base text-ctp-text p-2 rounded-md mb-2 border-2 border-transparent hover:border-${colorPrimary} cursor-pointer`
            }
            onClick={() => handleSelectSession(sessionId)}
          >
            <div className="flex justify-between">
              <div className="font-bold">Session ID</div>
              <div className="font-bold">{sessionId}</div>
            </div>
            <div className="flex justify-between">
              <div className="font-bold">Status</div>
              <div className="font-bold">Connected</div>
            </div>
          </div>
        ))}
        <div
          className="w-full bg-ctp-blue text-ctp-base p-3 rounded-lg text-center cursor-pointer"
          onClick={handleLogin}
        >
          Login
        </div>
      </div>
    </div>
  );
};

export default SelectSessionId;
