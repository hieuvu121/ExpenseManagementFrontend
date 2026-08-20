/**
 * The same numbers the chart draws, as a real table, visually hidden.
 *
 * Chart.js renders into a <canvas>, which is completely opaque to assistive
 * tech — an aria-label can only ever summarise it. A table lets a screen-reader
 * user read the actual series, and it is what browser find-in-page and text
 * translation see too.
 */
interface ChartTableProps {
  caption: string;
  columns: string[];
  rows: (string | number)[][];
}

export function ChartTable({ caption, columns, rows }: ChartTableProps) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column} scope="col">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) =>
              j === 0 ? (
                <th key={j} scope="row">
                  {cell}
                </th>
              ) : (
                <td key={j}>{cell}</td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
