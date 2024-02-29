import {
  fetchAllAverageSalaries,
  fetchAllSalariesByGrouping,
} from "@/app/data-fetch/data";
import { Card, Divider, BarChart, ValueFormatter } from "@tremor/react";

const dataFormatter = (number: number) =>
  Intl.NumberFormat("us").format(number).toString();

export async function SalaryData() {
  const allAverageSalaries = await fetchAllAverageSalaries();
  const nonFaangAverageSalaries = await fetchAllAverageSalaries(true);
  const salaryChartData = await fetchAllSalariesByGrouping();
  console.log(salaryChartData);
  return (
    <Card>
      <h2 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
        Salary Data
      </h2>
      <Divider></Divider>
      <ul>
        <li>
          Average Salary:{" "}
          <span className="text-tremor-content-subtle">
            {allAverageSalaries.average}
          </span>
        </li>
        <li>
          Average Salary without FAANG:{" "}
          <span className="text-tremor-content-subtle">
            {nonFaangAverageSalaries.average}
          </span>
        </li>
      </ul>
      <BarChart
        className="mt-6"
        data={salaryChartData}
        index="salary_range"
        categories={["count"]}
        colors={["blue"]}
        yAxisWidth={48}
      />
    </Card>
  );
}
