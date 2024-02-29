import { SalaryData } from "@/components/SalaryData";
import { fetchAllOffers } from "../data-fetch/data";

export default async function ViewData() {
  const allOffers = await fetchAllOffers();
  const totalDataPoints = allOffers.length;

  return (
    <main className="p-10">
      <h1 className="text-tremor-title font-semibold py-10">
        Total Data Points:{" "}
        <span className="text-tremor-content-subtle">{totalDataPoints}</span>
      </h1>
      <SalaryData />
    </main>
  );
}
