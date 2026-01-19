"use server";

import { prisma } from "@/lib/prisma";
import { Weather } from "@/generated/prisma/client";

type DbQuerySuccessType = {
  error: null;
  data: Weather[];
};

type DbQueryErrorType = {
  error: string;
  data: null;
};

type DbQueryType = DbQuerySuccessType | DbQueryErrorType;

export async function QueryDbAction(): Promise<DbQueryType> {
  // ------------------------------------------------
  // for debugging
  const currentDate = new Date();
  console.log();
  console.log(currentDate.toLocaleTimeString());
  console.log(">>>query-db-action.ts");
  // ------------------------------------------------

  try {
    const dbResponse = await prisma.weather.findMany();
    // const weatherData = dbResponse

    // return data to browser
    return {
      error: null,
      data: dbResponse, // or weatherResults?
    };
  } catch (err) {
    console.log("Error in database fetching:", err);
    return { error: String(err), data: null };
  }
}
