"use client";

export default function DataTable(weatherResults) {
  // ------------------------------------------------
  // for debugging
  const currentDate = new Date();
  console.log();
  console.log(currentDate.toLocaleTimeString());
  console.log(">>>data-table.tsx");
  // ------------------------------------------------

  console.log("weatherResults:", weatherResults);
  console.log("weatherResults.time:", weatherResults.time);

  return (
    <>
      {weatherResults && (
        <div className="mt-8 max-h-96 overflow-y-auto border rounded">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-100">
              <tr>
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">Temperature (°C)</th>
              </tr>
            </thead>
            <tbody>
              {/* there are SEEMING errors here because ts doesn't know the structure of weatherResults */}
              {/* @ts-expect-error - weatherResults type not defined */}
              {weatherResults.time.map((time: string, i: number) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{new Date(time).toLocaleString()}</td>
                  <td className="p-2">
                    {/* @ts-expect-error - weatherResults type not defined */}
                    {weatherResults.temperature_2m[i]?.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
