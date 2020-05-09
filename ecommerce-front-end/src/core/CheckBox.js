import React, { useState } from 'react';

const CheckBox = ({ categories, handleFilters }) => {
  const [checked, setChecked] = useState([]);

  const handleToggle = id => () => {
    const currentCategoryId = checked.indexOf(id);
    const newCheckedCategoryId = [...checked];

    // if currently checked was not already inside the state > push
    //  else pull/take off

    if (currentCategoryId === -1) {
      newCheckedCategoryId.push(id);
    } else {
      newCheckedCategoryId.splice(currentCategoryId, 1);
    }
    setChecked(newCheckedCategoryId);
    handleFilters(newCheckedCategoryId);
  };

  return categories.map((c, i) => (
    <li key={i} className="list-unstyled">
      <input
        className="form-check-input"
        value={checked.indexOf(c._id === -1)}
        onChange={handleToggle(c._id)}
        type="checkbox"
      />
      <label className="form-check-label">{c.name}</label>
    </li>
  ));
};

export default CheckBox;
