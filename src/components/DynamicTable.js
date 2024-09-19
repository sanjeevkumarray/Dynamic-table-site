// src/components/DynamicTable.js
import React, { useState } from 'react';

const DynamicTable = () => {
  const [columns, setColumns] = useState([]);  // Store table columns
  const [rows, setRows] = useState([]);        // Store table rows
  const [filters, setFilters] = useState({});  // Store column filters
  const [sort, setSort] = useState({});        // Store sorting configuration

  // Add a new column (either "string" or "number")
  const addColumn = (name, type) => {
    setColumns([...columns, { name, type }]);
  };

  // Add a new row with empty/default data
  const addRow = () => {
    const newRow = {};
    columns.forEach((col) => {
      newRow[col.name] = col.type === 'string' ? [''] : [0]; // Initialize with empty array or number
    });
    setRows([...rows, newRow]);
  };

  // Update cell data
  const updateCell = (rowIndex, colName, value) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][colName] = value;
    setRows(updatedRows);
  };

  // Filter rows based on column filters
  const applyFilter = () => {
    let filteredRows = [...rows];
    Object.keys(filters).forEach((colName) => {
      if (filters[colName]) {
        filteredRows = filteredRows.filter((row) =>
          row[colName].includes(filters[colName])
        );
      }
    });
    return filteredRows;
  };

  // Sort rows based on selected numeric column and criteria
  const applySort = (filteredRows) => {
    if (sort.column) {
      const sortedRows = [...filteredRows].sort((a, b) => {
        if (sort.type === '>=') {
          return a[sort.column][0] - b[sort.column][0];
        } else if (sort.type === '<=') {
          return b[sort.column][0] - a[sort.column][0];
        }
        return 0;
      });
      return sortedRows;
    }
    return filteredRows;
  };

  // Apply filtering and sorting logic to rows
  const filteredAndSortedRows = applySort(applyFilter());

  return (
    <div>
      <h2>Dynamic Table</h2>

      {/* Add Column Form */}
      <div>
        <input id="colName" placeholder="Column Name" />
        <select id="colType">
          <option value="string">String</option>
          <option value="number">Number</option>
        </select>
        <button onClick={() =>
          addColumn(document.getElementById('colName').value, document.getElementById('colType').value)}>
          Add Column
        </button>
      </div>

      {/* Add Row Button */}
      <div>
        <button onClick={addRow}>Add Row</button>
      </div>

      {/* Filter Rows */}
      <div>
        <h4>Filter Rows</h4>
        {columns.map((col) => (
          <div key={col.name}>
            <label>{col.name}</label>
            <input
              type="text"
              onChange={(e) =>
                setFilters({ ...filters, [col.name]: e.target.value })
              }
              placeholder={`Filter ${col.type}`}
            />
          </div>
        ))}
      </div>

      {/* Sort Rows */}
      <div>
        <h4>Sort Rows</h4>
        <select
          onChange={(e) =>
            setSort({ ...sort, column: e.target.value })
          }>
          <option value="">Select Column</option>
          {columns.map((col) => (
            col.type === 'number' && <option key={col.name} value={col.name}>{col.name}</option>
          ))}
        </select>
        <select
          onChange={(e) =>
            setSort({ ...sort, type: e.target.value })
          }>
          <option value="">Select Sort Type</option>
          <option value=">=">Greater than or equal to</option>
          <option value="<=">Less than or equal to</option>
        </select>
      </div>

      {/* Display Table */}
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.name}>{col.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => (
                <td key={col.name}>
                  <input
                    type={col.type === 'number' ? 'number' : 'text'}
                    value={row[col.name]}
                    onChange={(e) =>
                      updateCell(rowIndex, col.name, e.target.value)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;
