import DarkModeToggle from "react-dark-mode-toggle";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTheme, toggle } from "../../redux/themeSlice";
import "./ToggleTheme.css";

function ToggleTheme() {
  const dispatch = useDispatch(),
    theme = useSelector(selectTheme);

  return (
    <div className="toggleTheme">
      <DarkModeToggle
        className="darkModeButton"
        onChange={() => {
          dispatch(toggle());
        }}
        checked={theme}
        speed={10}
        size={48}
      />
    </div>
  );
}

export default ToggleTheme;
