"use server";

import { fetchWeatherApi } from "openmeteo";
// import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// note that in the better auth tutorial, some of my action files are .action.ts and some are -action.ts... i think it doesn't technically matter, but you should choose one

export async function searchWeatherForecastAction(formData: FormData) {
  // ------------------------------------------------
  // for debugging
  console.log("---------------------------------------");
  const currentDate = new Date();
  console.log(currentDate.toLocaleTimeString());
  console.log(">>>search-weather-forecast-action.ts");
  console.log("---------------------------------------");
  // ------------------------------------------------
  try {
    // https://open-meteo.com/en/docs/ecmwf-api

    // convert to numbers
    // ?

    const params = {
      // do i need to wrap certain params in String()?
      // i added default values with OR operators, but i expect this won't play nicely for long because i'll want my form to DEMAND inputs
      latitude: formData.get("latitude") || 52.52,
      longitude: formData.get("longitude") || 13.41,
      hourly: formData.get("hourly") || "temperature_2m",
      past_days: formData.get("past_days") || 2, // get last e.g. 2 days
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const latitude = response.latitude();
    const longitude = response.longitude();
    const elevation = response.elevation();
    const utcOffsetSeconds = response.utcOffsetSeconds();

    console.log(
      `\nCoordinates: ${latitude}°N ${longitude}°E`,
      // `\nDate range: ${start_dateInput} - ${end_dateInput}`,
      `\nHourly: ${params["hourly"]}`,
      `\nElevation: ${elevation}m asl`,
      `\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`
    );

    // this bang is typescript's non-null assertion operator: use this "when you know that a null value cannot occur"
    // How to handle that the hourly may be one value OR it may be a list? just handle one value for now, but we will want to handle ["wind_speed_10m", "wind_direction_10m"]... could try a ternary operator
    const hourly = response.hourly()!;
    //   const hourly = typeof hourly === ... ? response.hourly()! : ... ; // or try doing if hourly contains comma, treat it as an array

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
      hourly: {
        time: Array.from(
          {
            length:
              (Number(hourly.timeEnd()) - Number(hourly.time())) /
              hourly.interval(),
          },
          (_, i) =>
            new Date(
              (Number(hourly.time()) +
                i * hourly.interval() +
                utcOffsetSeconds) *
                1000
            )
        ),
        // again here we see the non-null assertion operator
        temperature_2m: hourly.variables(0)!.valuesArray(),
      },
    };

    // The 'weatherData' object now contains a simple structure, with arrays of datetimes and weather information
    console.log("\nHourly data:\n", weatherData.hourly);

    // save all hours to db at once
    const weatherRecords = weatherData.hourly.time
      .map((time, i) => {
        // `?.` is optional chaining... safely access the array even if temperature_2m is null
        const temp = weatherData.hourly.temperature_2m?.[i];
        // skip if temp is null
        if (temp === null || temp === undefined) return null;

        return {
          latitude: latitude,
          longitude: longitude,
          elevation: elevation,
          timestamp: weatherData.hourly.time[i],
          temperature_2m: temp,
        };
      })
      // remove nulls and use `as any` to say "typescript just trust me bro"
      .filter(Boolean) as any;

    // then insert all at once
    await prisma.weather.createMany({
      data: weatherRecords,
    });

    console.log(
      `\nSaved ${weatherRecords.length} weather records to database\n`
    );

    return {
      error: null,
      data: weatherData.hourly,
    };
  } catch (err) {
    console.log("err:", err);
    console.log("err.name:", err.name);
    console.log("err.message:", err.message);
    return { error: String(err), data: null };
  }
}
