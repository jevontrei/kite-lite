"use server";

import { prisma } from "@/lib/prisma";

export async function QueryDbAction(formData) {
  // ------------------------------------------------
  // for debugging
  const currentDate = new Date();
  console.log(currentDate.toLocaleTimeString());
  console.log(">>>query-db-action.ts");
  // ------------------------------------------------
  try {
    const dbResponse = await prisma.weather.findMany();
    // const weatherData = dbResponse

    return {
      error: null,
      data: dbResponse.hourly, // or weatherResults?
    };
  } catch (err) {
    console.log("Error in database fetching:", err);
    return { error: String(err), data: null };
  }
}
