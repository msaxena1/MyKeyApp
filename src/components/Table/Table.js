import "./Table.css";

const Table = ({ content }) => {
  let tableContents;

  tableContents = content.map((entry, index) => {
    if (entry.update) {
      return (
        <tr key={index}>
          <td>
            <strong>{entry.key}</strong>
          </td>
          <td>
            <input
              type="text"
              value={entry.value}
              onChange={(e) => entry.update(e.target.value)}
            />
          </td>
        </tr>
      );
    } else {
      return (
        <tr key={index}>
          <td>
            <strong>{entry.key}</strong>
          </td>
          <td>{entry.value}</td>
        </tr>
      );
    }
  });
  return (
    <table>
      <tbody>{tableContents}</tbody>
    </table>
  );
};

export default Table;
