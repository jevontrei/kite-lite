"use server";

import { fetchWeatherApi } from "openmeteo";
import { headers } from "next/headers";

// note that in the better auth tutorial, some of my action files are .action.ts and some are -action.ts... i think it doesn't technically matter, but you should choose one

export async function searchWeatherAction(formData: FormData) {
  // try {
  //
  // } catch (err) {
  //
  // }
  // https://open-meteo.com/en/docs/historical-weather-api
  const params = {
    // do i need to wrap certain params in String()?
    // i added default values with OR operators, but i expect this won't play nicely for long because i'll want my form to DEMAND inputs
    latitude: formData.get("latitude") || 52.52,
    longitude: formData.get("longitude") || 13.41,
    start_date: formData.get("start_date") || "2025-12-12",
    end_date: formData.get("end_date") || "2025-12-13",
    hourly: formData.get("hourly") || "temperature_2m",
  };
  const url = "https://archive-api.open-meteo.com/v1/archive";
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
            (Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) *
              1000
          )
      ),
      // again here we see the non-null assertion operator
      temperature_2m: hourly.variables(0)!.valuesArray(),
    },
  };

  // The 'weatherData' object now contains a simple structure, with arrays of datetimes and weather information
  console.log("\nHourly data:\n", weatherData.hourly);

  //////////////////////////////////////////////////////////////////////
  // TO INTEGRATE
  //   try {
  //       await ...({
  //           headers: await headers(),
  //           body: {
  //               ...
  //           }
  //       })
  //   } catch (err) {
  //       return { error: "Internal server error" };
  //   }
  //////////////////////////////////////////////////////////////////////
}
