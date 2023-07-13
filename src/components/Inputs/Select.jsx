import React from "react";

const Select = ({ label, id, value, onChange, error, options }) => {
  return (
    <div className="flex-auto">
      <label htmlFor={id} className="text-ctp-text text-sm font-semibold">
        {label}
      </label>
      <select
        className="w-full h-12 rounded-xl bg-ctp-surface1 text-ctp-text px-4 outline-none focus:ring-2 focus:ring-ctp-flamingo focus:ring-opacity-50 transition-all duration-300 ease-in-out hover:bg-ctp-surface2 cursor-pointer mt-2"
        id={id}
        name={id}
        value={value}
        onChange={onChange}
      >
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-ctp-red text-sm font-semibold">{error}</span>
      )}
    </div>
  );
};

export default Select;
