"use server";

import { fetchWeatherApi } from "openmeteo";
// import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// note that in the better auth tutorial, some of my action files are .action.ts and some are -action.ts... i think it doesn't technically matter, but you should choose one

export async function searchForecastAction(formData: FormData) {
  // ------------------------------------------------
  // for debugging
  const currentDate = new Date();
  console.log();
  console.log(currentDate.toLocaleTimeString());
  console.log(">>>search-forecast-action.ts");
  // ------------------------------------------------
  try {
    // https://open-meteo.com/en/docs/ecmwf-api

    // Extract inputs
    const latitude_input = formData.get("latitude") || 52.52;
    const longitude_input = formData.get("longitude") || 13.41;
    // why does the default 2-past-days request return more than 2 days? -> because this API defaults to sending 10 days of data? and so is past_days added on top of that? idk
    const past_days_input = formData.get("past_days") || 0; // get last e.g. 2 days (? hmmm confim functionality)
    const hourly_input = formData.get("hourly") || "temperature_2m";

    console.log("past_days_input:", past_days_input);

    // convert to numbers
    const latitude = Number(latitude_input);
    const longitude = Number(longitude_input);
    const past_days = Number(past_days_input);
    console.log("past_days:", past_days);

    // validate
    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      console.log(">>>lat error");
      return {
        error: "Invalid latitude; must be between -90 and 90",
        data: null,
      };
    }

    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      console.log(">>>lon error");
      return {
        error: "Invalid longitude; must be between -180 amnd 180",
        data: null,
      };
    }

    // open-meteo API max past_days is 92
    if (isNaN(past_days) || past_days < 0 || past_days > 92) {
      console.log(">>>past_days error");
      return {
        error: "Invalid past_days; must be between 0 and 92",
        data: null,
      };
    }

    const params = {
      // do i need to wrap certain params in String()?
      // i added default values with OR operators, but i expect this won't play nicely for long because i'll want my form to DEMAND inputs
      latitude: latitude,
      longitude: longitude,
      past_days: past_days,
      hourly: hourly_input,
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const apiLatitude = response.latitude();
    const apiLongitude = response.longitude();
    const apiElevation = response.elevation();
    const apiUtcOffsetSeconds = response.utcOffsetSeconds();

    console.log(
      `\nCoordinates: ${apiLatitude}°N ${apiLongitude}°E`,
      `\nHourly: ${params["hourly"]}`,
      `\nElevation: ${apiElevation}m asl`,
      `\nTimezone difference to GMT+0: ${apiUtcOffsetSeconds}s`
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
                apiUtcOffsetSeconds) *
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
          elevation: apiElevation,
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
    console.log("Error in weather forecast search:", err);
    return { error: String(err), data: null };
  }
}
