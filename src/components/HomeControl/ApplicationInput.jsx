import React, { useEffect, useState } from "react";
import Input from "../Inputs/Input";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setShowModalSelectSession } from "../../app/home/homeSlice";

const ApplicationInput = () => {
  const [applicationId, setApplicationId] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (applicationId === "") {
      toast.error("Application ID is required");
      return;
    }

    try {
      await setDataLocal(); // Save the applicationId to local storage
      dispatch(setShowModalSelectSession(true));
      setIsLogged(true); // Update the login state
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };

  const handleLogout = async () => {
    const sessionId = await window.RPCStorage.get("sessionId");
    const response = await window.electron.logout(sessionId.value);
    window.RPCStorage.set("sessionId", "");
    window.RPCStorage.set("applicationId", "");
    window.RPCStorage.set("isLogged", false);
    setApplicationId("");
    if (response.success) {
      toast.success("Logout success");
      
      setIsLogged(false);
    } else {
      toast.error("Logout failed. Please try again.");
    }
  };

  const setDataLocal = async () => {
    await window.RPCStorage.set("applicationId", applicationId);
  };

  // Check if the user is logged in based on the presence of the applicationId in local storage
  useEffect(() => {
    const checkLoginStatus = async () => {
      const storedApplicationId = await window.RPCStorage.get("applicationId");
      const storedIsLogged = await window.RPCStorage.get("isLogged");
      if (storedApplicationId.value && storedIsLogged.value) {
        setIsLogged(true);
        setApplicationId(storedApplicationId.value);
      }
    };
    checkLoginStatus();
  }, []);

  return (
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
  );
};

export default ApplicationInput;
