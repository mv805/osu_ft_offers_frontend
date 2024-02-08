"use client";

import React, { useEffect, useState } from "react";
import { Select, SelectItem } from "@tremor/react";

type DataItem = {
  [key: string]: any;
};

type DataSelectorProps = {
  url: string;
  displayField: string;
  idField: string;
  onValueChange: (value: string) => void;
  htmlId: string;
  className: string;
};

const DataSelector: React.FC<DataSelectorProps> = ({
  url,
  displayField,
  idField,
  onValueChange: onValueChangeFromParent,
  htmlId,
  className: classNameFromParent,
}) => {
  const [dataItems, setItems] = useState<DataItem[]>([]);

  const findIdHandler = (value: string) => {
    const selectedItem = dataItems.find((item) => item[displayField] === value);
    if (selectedItem) {
      onValueChangeFromParent(selectedItem[idField]);
    } else {
      onValueChangeFromParent("N/A");
    }
  };

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error("Error:", error));
  }, [url]);

  return (
    <Select
      className={classNameFromParent ? classNameFromParent : ""}
      defaultValue="N/A"
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
