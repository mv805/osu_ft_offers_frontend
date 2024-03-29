"use client";
import React, { useState, useEffect } from "react";
import { RiAlarmWarningLine } from "@remixicon/react";
import { Suspense } from "react";
import {
  Card,
  TextInput,
  Divider,
  Select,
  SelectItem,
  DatePicker,
  DatePickerValue,
  NumberInput,
  Callout,
} from "@tremor/react";
import DataSelector from "./DataSelector";
import { FormValues } from "../../dataTypes";
// {
//     "userName": "testname",
//     "offerDate": "2021-05-08",
//     "personalProject": 1,
//     "returnship": 1,
//     "timeInProgram": 0.9,
//     "salary": 50000,
//     "gpa": 3.89,
//     "swePosition": 1,
//     "bigTechOffer": 0,
//     "ageOfCandidate": 44,
//     "idOfferSource": 2,
//     "idOfficeLocation": null,
//     "idWorkArrangement": 1,
//     "idPriorExperience": 1,
//     "idPreviousDegree": 1
// }

type AddOfferProps = {
  port: number;
};

const initialValues = {
  userName: "",
  offerDate: new Date().toISOString().split("T")[0],
  personalProject: 0,
  returnship: 0,
  timeInProgram: 1.0,
  salary: null,
  gpa: null,
  swePosition: 1,
  bigTechOffer: 0,
  ageOfCandidate: null,
  idOfferSource: null,
  idOfficeLocation: null,
  idWorkArrangement: null,
  idPriorExperience: null,
  idPreviousDegree: null,
};

const AddOffer: React.FC<AddOfferProps> = ({ port }) => {
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const [gpaInputValue, setGpaInputValue] = useState("");
  const [timeInProgramValue, setTimeInProgramValue] = useState("1.00");
  const [error, setError] = useState<string | null>(null);
  const [lastOfferID, setLastOfferID] = useState<number | null>(null);

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3030/api/offers/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`HTTP error, response not ok: ${errorMessage}`);
      }

      const data = await response.json();
      setLastOfferID(data.newOfferId);
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          "An error occurred while making the POST request:",
          error.message
        );
        setError(error.message);
      } else {
        console.error("An unknown error occurred:", error);
        setError("An Unknown Error Occured.");
      }
    }
  };
  /**
   * Handles the change event of an input element and updates the state.
   * @param e - The change event object.
   * @param setState - The state setter function.
   */
  const handleBlurInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setState(e.target.value);
  };

  /**
   * Handles the input change for a form fields that dont require the other specific handlers such as strings and multiselect.
   * @param formField - The name of the form field.
   * @param value - The new value of the form field.
   */
  const handleInputChange = (formField: string, value: string) => {
    if (value === "N/A") {
      setFormValues({
        ...formValues,
        [formField]: null,
      });
    } else {
      setFormValues({
        ...formValues,
        [formField]: value !== undefined && value !== null ? value : "",
      });
    }
  };

  /**
   * Handles the change of the date picker value.
   * @param {DatePickerValue} newDate - The new date value selected.
   * @returns {void}
   */
  const handleDateChange = (newDate: DatePickerValue) => {
    if (!newDate) {
      setFormValues({
        ...formValues,
        offerDate: new Date().toISOString().split("T")[0],
      });
      return;
    }

    const year = newDate.getUTCFullYear();
    const month = newDate.getUTCMonth() + 1; // getMonth() returns a zero-based month, so add 1
    const date = newDate.getUTCDate();

    let formattedDate = `${year}-${month.toString().padStart(2, "0")}-${date
      .toString()
      .padStart(2, "0")}`;

    setFormValues({
      ...formValues,
      offerDate: formattedDate,
    });
  };

  /**
   * Handles the change event for a yes/no form field.
   * @param formField - The name of the form field.
   * @param answer - The answer for the form field.
   */
  const handleYesNoChange = (formField: string, answer: string) => {
    setFormValues({
      ...formValues,
      [formField]: parseInt(answer),
    });
  };

  /**
   * Handles the change of a number input field. For numbers that are NOT decimals.
   * @param formField - The name of the form field.
   * @param numberString - The string representation of the number.
   */
  const handleNumberChange = (formField: string, numberString: string) => {
    if (numberString === "") {
      setFormValues({
        ...formValues,
        [formField]: null,
      });
      return;
    } else {
      let integerNumber = parseInt(numberString);
      if (isNaN(integerNumber)) {
        return;
      }
      setFormValues({
        ...formValues,
        [formField]: integerNumber,
      });
    }
  };

  /**
   * Handles the blur event for decimal input fields.
   * @param formField - The name of the form field.
   * @param numberString - The input value as a string.
   * @param min - The minimum allowed value.
   * @param max - The maximum allowed value.
   */
  const handleDecimalChangeBlur = (
    formField: string,
    numberString: string,
    min: number,
    max: number
  ) => {
    if (numberString === "") {
      setFormValues({
        ...formValues,
        [formField]: null, // Set to empty string if input is empty
      });
    } else {
      let floatNumber = parseFloat(numberString);
      // Format the number to two decimal places
      let clampedAndFormattedNumber = Math.max(
        min,
        Math.min(floatNumber, max)
      ).toFixed(2);
      setFormValues({
        ...formValues,
        [formField]: parseFloat(clampedAndFormattedNumber),
      });
      if (formField === "gpa") {
        setGpaInputValue(clampedAndFormattedNumber);
      } else if (formField === "timeInProgram") {
        setTimeInProgramValue(clampedAndFormattedNumber);
      }
    }
  };

  const resetForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFormValues({
      ...initialValues,
    });
    setTimeInProgramValue("1.00");
    setGpaInputValue("");
    setError(null);
    setLastOfferID(null);
  };

  useEffect(() => {
    console.log(formValues);
  }, [formValues]);

  return (
    <Card className="my-8">
      <div className="sm:mx-auto sm:max-w-2xl">
        <h3 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
          Add a new Offer
        </h3>
        <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
          This is where you put the new offer data points
        </p>
        <form className="mt-8" onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
            <div className="col-span-full sm:col-span-3">
              <label
                htmlFor="user-name"
                className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
              >
                User Name
                <span className="text-red-500">*</span>
              </label>
              <TextInput
                type="text"
                id="user-name"
                name="userName"
                placeholder="User Name"
                value={formValues.userName ? formValues.userName : ""}
                onChange={(e) => {
                  handleInputChange("userName", e.target.value);
                }}
                className="mt-2"
                required
              />
            </div>
            <div className="col-span-full sm:col-span-3">
              <label
                htmlFor="offer-date"
                className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
              >
                Offer Date
                <span className="text-red-500">*</span>
              </label>
              <DatePicker
                id="offer-date"
                className="mt-2"
                value={
                  formValues.offerDate
                    ? new Date(formValues.offerDate + "T00:00")
                    : new Date()
                }
                onValueChange={handleDateChange}
              />
            </div>
          </div>
          <Divider className="col-span-full">
            Enter some more mandatory data
          </Divider>
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
            <div className="col-span-full sm:col-span-3">
              <label
                htmlFor="projects"
                className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
              >
                Projects
                <span className="text-red-500">*</span>
                <p className="text-tremor-content-subtle">
                  Did they reference any personal projects in the interview?
                </p>
              </label>
              <Select
                id="projects"
                value={formValues.personalProject === 1 ? "1" : "0"}
                onValueChange={(value) => {
                  handleYesNoChange("personalProject", value);
                }}
              >
                <SelectItem value="1">Yes</SelectItem>
                <SelectItem value="0">No</SelectItem>
              </Select>
            </div>
            <div className="col-span-full sm:col-span-3">
              <label
                htmlFor="returnship"
                className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
              >
                Returnship
                <span className="text-red-500">*</span>
                <p className="text-tremor-content-subtle">
                  Did they recieve the offer as a result of return offer from
                  internship?
                </p>
              </label>
              <Select
                id="returnship"
                value={formValues.returnship === 1 ? "1" : "0"}
                onValueChange={(value) => {
                  handleYesNoChange("returnship", value);
                }}
              >
                <SelectItem value="1">Yes</SelectItem>
                <SelectItem value="0">No</SelectItem>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
            <div className="col-span-full sm:col-span-3">
              <label
                htmlFor="swe-position"
                className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
              >
                SWE Position
                <span className="text-red-500">*</span>
                <p className="text-tremor-content-subtle">
                  Was the offer for a software development position?
                </p>
              </label>
              <Select
                id="swe-position"
                value={formValues.swePosition === 1 ? "1" : "0"}
                onValueChange={(value) => {
                  handleYesNoChange("swePosition", value);
                }}
              >
                <SelectItem value="1">Yes</SelectItem>
                <SelectItem value="0">No</SelectItem>
              </Select>
            </div>
            <div className="col-span-full sm:col-span-3">
              <label
                htmlFor="big-tech-offer"
                className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
              >
                Big Tech
                <span className="text-red-500">*</span>
                <p className="text-tremor-content-subtle">
                  Was the offer from a big tech company (FAANG)?
                </p>
              </label>
              <Select
                id="big-tech-offer"
                value={formValues.bigTechOffer === 1 ? "1" : "0"}
                onValueChange={(value) => {
                  handleYesNoChange("bigTechOffer", value);
                }}
              >
                <SelectItem value="1">Yes</SelectItem>
                <SelectItem value="0">No</SelectItem>
              </Select>
            </div>
          </div>

          <Divider className="col-span-full">Enter some optional data</Divider>
          <div className="col-span-full sm:col-span-3">
            <label
              htmlFor="salary"
              className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
              Salary
            </label>
            <TextInput
              type="text"
              id="salary"
              name="salary"
              placeholder="Salary"
              value={formValues.salary ? formValues.salary.toString() : ""}
              onChange={(e) => {
                handleNumberChange("salary", e.target.value);
              }}
              className="mt-2"
            />
          </div>
          <div className="col-span-full sm:col-span-3">
            <label
              htmlFor="GPA"
              className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
              GPA
            </label>
            <p className="text-tremor-content-subtle">
              Enter in decimal up to two places
            </p>
            <NumberInput
              id="GPA"
              placeholder="X.XX"
              value={gpaInputValue}
              onChange={(e) => {
                handleBlurInputChange(e, setGpaInputValue);
              }}
              onBlur={(e) => {
                handleDecimalChangeBlur("gpa", e.target.value, 0, 4);
              }}
              enableStepper={false}
            />
          </div>
          <div className="col-span-full sm:col-span-3">
            <label
              htmlFor="time-in-program"
              className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
              Time in Program
            </label>
            <p className="text-tremor-content-subtle">
              Enter a percentage time in program in decimal form (1.00-0.00)
            </p>
            <NumberInput
              id="time-in-program"
              placeholder="X.XX"
              value={timeInProgramValue}
              onChange={(e) => {
                handleBlurInputChange(e, setTimeInProgramValue);
              }}
              onBlur={(e) => {
                handleDecimalChangeBlur("timeInProgram", e.target.value, 0, 1);
              }}
              enableStepper={false}
            />
          </div>
          <div className="col-span-full sm:col-span-3">
            <label
              htmlFor="age-of-candidate"
              className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
              Age of Candidate
            </label>
            <TextInput
              type="text"
              id="age-of-candidate"
              name="age-of-candidate"
              placeholder="Age"
              value={
                formValues.ageOfCandidate
                  ? formValues.ageOfCandidate.toString()
                  : ""
              }
              onChange={(e) => {
                handleNumberChange("ageOfCandidate", e.target.value);
              }}
              className="mt-2"
            />
          </div>
          <div className="col-span-full sm:col-span-3">
            <label
              htmlFor="office-location"
              className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
              Office Location
            </label>
            <DataSelector
              value={formValues.idOfficeLocation}
              htmlId="office-location"
              url={`http://localhost:${port}/api/office-locations/`}
              displayField="fullName"
              idField="idOfficeLocation"
              onValueChange={(locationId) => {
                handleInputChange("idOfficeLocation", locationId);
              }}
              className="mt-2"
            />
          </div>
          <div className="col-span-full sm:col-span-3">
            <label
              htmlFor="offer-source"
              className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
              Offer Source
            </label>
            <DataSelector
              value={formValues.idOfferSource}
              htmlId="offer-source"
              url={`http://localhost:${port}/api/offer-sources/`}
              displayField="type"
              idField="idOfferSource"
              onValueChange={(typeId) => {
                handleInputChange("idOfferSource", typeId);
              }}
              className="mt-2"
            />
          </div>
          <div className="col-span-full sm:col-span-3">
            <label
              htmlFor="work-arrangement"
              className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
              Work Arrangement
            </label>
            <DataSelector
              value={formValues.idWorkArrangement}
              htmlId="work-arrangement"
              url={`http://localhost:${port}/api/work-arrangements/`}
              displayField="arrangement"
              idField="idWorkArrangement"
              onValueChange={(arrangementId) => {
                handleInputChange("idWorkArrangement", arrangementId);
              }}
              className="mt-2"
            />
          </div>
          <div className="col-span-full sm:col-span-3">
            <label
              htmlFor="prior-experience"
              className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
              Prior Experience
            </label>
            <DataSelector
              value={formValues.idPriorExperience}
              htmlId="prior-experience"
              url={`http://localhost:${port}/api/previous-experiences/`}
              displayField="experienceType"
              idField="idPriorExperience"
              onValueChange={(experienceId) => {
                handleInputChange("idPriorExperience", experienceId);
              }}
              className="mt-2"
            />
          </div>
          <div className="col-span-full sm:col-span-3">
            <label
              htmlFor="previous-degree"
              className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
              Previous Degree
            </label>
            <DataSelector
              value={formValues.idPreviousDegree}
              htmlId="previous-degree"
              url={`http://localhost:${port}/api/previous-degrees/`}
              displayField="degreeType"
              idField="idPreviousDegree"
              onValueChange={(previousDegreeID) => {
                handleInputChange("idPreviousDegree", previousDegreeID);
              }}
              className="mt-2"
            />
          </div>
          <Divider />
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6"></div>
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={resetForm}
              className="whitespace-nowrap rounded-tremor-small px-4 py-2.5 text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
              Reset
            </button>
            <button
              type="submit"
              className="whitespace-nowrap rounded-tremor-default bg-tremor-brand px-4 py-2.5 text-tremor-default font-medium text-tremor-brand-inverted shadow-tremor-input hover:bg-tremor-brand-emphasis dark:bg-dark-tremor-brand dark:text-dark-tremor-brand-inverted dark:shadow-dark-tremor-input dark:hover:bg-dark-tremor-brand-emphasis"
            >
              Submit
            </button>
          </div>
          {error && (
            <Callout
              className="mt-4"
              title="Submit Error"
              icon={RiAlarmWarningLine}
              color="rose"
            >
              {`${error}`}
            </Callout>
          )}
          {lastOfferID && (
            <Callout
              className="mt-4"
              title="Success!"
              icon={RiAlarmWarningLine}
              color="teal"
            >
              {`Last Offer input ID: ${lastOfferID}`}
            </Callout>
          )}
        </form>
      </div>
    </Card>
  );
};

export default AddOffer;
