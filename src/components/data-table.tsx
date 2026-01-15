"use client";

export default function DataTable({ weatherResults }) {
  // ------------------------------------------------
  // for debugging
  const currentDate = new Date();
  console.log();
  console.log(currentDate.toLocaleTimeString());
  console.log(">>>data-table.tsx");
  // ------------------------------------------------

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
              {weatherResults.map((_: object, i: number) => (
                <tr key={i} className="border-t">
                  <td className="p-2">
                    {new Date(weatherResults[i].timestamp).toLocaleString()}
                  </td>
                  <td className="p-2">
                    {weatherResults[i].temperature_2m?.toFixed(1)}
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
