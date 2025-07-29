import React from "react";
import "./App.css";

import ReusableDropdown from "./ReusableDropDown";

const App: React.FC = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Reusable Dropdown</h1>
      <ReusableDropdown initialItems={["Apple", "Banana", "Orange"]} />
    </div>
  );
};

export default App;
