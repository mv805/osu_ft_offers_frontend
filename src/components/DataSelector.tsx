"use client";

import React, { useEffect, useState } from "react";
import { Select, SelectItem } from "@tremor/react";

type DataItem = {
  [key: string]: any;
};

type DataSelectorProps = {
  value: number | null;
  url: string;
  displayField: string;
  idField: string;
  onValueChange: (value: string) => void;
  htmlId: string;
  className: string;
};

/**
 * A component that renders a data selector dropdown.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.url - The URL to fetch the data from.
 * @param {string} props.displayField - The database field to display in the dropdown.
 * @param {string} props.idField - The database field to use as the value when an item is selected. Should be primary key value.
 * @param {Function} props.onValueChange - The callback function to be called when a value is selected.
 * @param {string} props.htmlId - The HTML id attribute for the dropdown. USed to identify the unique react component key field. ( correlates to id="someID")
 * @param {string} props.className - The CSS class name(s) for the dropdown. Optional.
 * @returns {JSX.Element} The rendered data selector dropdown.
 */

const DataSelector: React.FC<DataSelectorProps> = ({
  value,
  url,
  displayField,
  idField,
  onValueChange: onValueChangeFromParent,
  htmlId,
  className: classNameFromParent,
}) => {
  const [dataItems, setItems] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);

  const findIdHandler = (value: string) => {
    const selectedItem = dataItems.find((item) => item[displayField] === value);
    if (selectedItem) {
      onValueChangeFromParent(selectedItem[idField]);
    } else {
      onValueChangeFromParent("N/A");
    }
  };

const setViewValue = () => {
  if (value === null) {
    return "N/A";
  } else {
    const item = dataItems.find((item) => item[idField] === value);
    return item ? item[displayField] : "N/A";
  }
};

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error:", error));
  }, [url]);

  return loading ? (
    <p>Loading...</p>
  ) : (
    <Select
      className={classNameFromParent ? classNameFromParent : ""}
      value={setViewValue()}
      onValueChange={findIdHandler}
      id={htmlId ? htmlId : ""}
    >
      <SelectItem key={`N/A-${htmlId}`} value="N/A">
        N/A
      </SelectItem>
      {dataItems.map((item, index) => (
        <SelectItem key={`${index}-${htmlId}`} value={item[displayField]}>
          {item[displayField]}
        </SelectItem>
      ))}
    </Select>
  );
};

export default DataSelector;
