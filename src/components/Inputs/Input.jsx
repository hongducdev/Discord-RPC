import React from "react";

const Input = ({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
}) => {
  return (
    <div className="flex-auto">
      <label htmlFor={id} className="text-ctp-text text-sm font-semibold">
        {label}
      </label>
      <input
        className="w-full h-12 rounded-xl bg-ctp-surface1 text-ctp-text px-4 outline-none focus:ring-2 focus:ring-ctp-flamingo focus:ring-opacity-50 transition-all duration-300 ease-in-out hover:bg-ctp-surface2 cursor-pointer mt-2"
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {error && (
        <span className="text-ctp-red text-sm font-semibold">{error}</span>
      )}
    </div>
  );
};

export default Input;
