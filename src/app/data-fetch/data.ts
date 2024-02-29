const backendPort = 3030;
/**
 * Fetches the average salaries of job offers.
 * @param faang - A boolean indicating whether to filter the results for FAANG companies.
 * @returns A promise that resolves to an object containing the average salary data.
 */
export async function fetchAllAverageSalaries(faang: boolean = false) {
  let response;
  try {
    if (faang) {
      response = await fetch(
        `http://localhost:${backendPort}/api/offers/salaries/average?max=150000`
      );
    } else {
      response = await fetch(
        `http://localhost:${backendPort}/api/offers/salaries/average`
      );
    }
    const data = await response.json();

    // Ensure data.average is a number before formatting
    if (typeof data.average === "number") {
      data.average = data.average.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }

    return data;
  } catch (error) {
    console.error("Error fetching average salaries:", error);
    return { average: "N/A" };
  }
}

export async function fetchAllOffers() {
    const response = await fetch(`http://localhost:${backendPort}/api/offers`);
    const data = await response.json();

    return data;
}

export async function fetchAllSalariesByGrouping() {
    const response = await fetch(
      `http://localhost:${backendPort}/api/offers/salaries/groups`
    );
    const data = await response.json();

    return data.salariesByGroup;
}