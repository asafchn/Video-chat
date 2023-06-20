import { useEffect, useState } from "react";
import { debounce } from "lodash";
import React from "react";
import "./input.css";
export const Input = ({
  onChange,
  withLabel,
  noBorder,
}: {
  onChange: (str: string) => void;
  withLabel: string;
  noBorder: boolean;
}) => {
  const [query, setQuery] = useState("");
  function computedId() {
    if (withLabel) {
      return `${withLabel}-input`;
    } else {
      return "";
    }
  }
  const debouncedSearch = debounce((text) => {
    setQuery(text);
  }, 1500);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    debouncedSearch(e.target.value);
  }

  function renderLabelIfNeeded() {
    if (withLabel) {
      return (
        <label className="label" htmlFor={computedId()}>
          {withLabel}
        </label>
      );
    } else {
      return null;
    }
  }

  useEffect(() => {
    if (query) {
      onChange(query);
    }
  }, [query]);

  return (
    <div className="input-container">
      {renderLabelIfNeeded()}
      <input
        className={`input ${noBorder ? "no-border" : ""}`}
        id={computedId()}
        placeholder="Search..."
        onChange={handleChange}
      ></input>{" "}
    </div>
  );
};
