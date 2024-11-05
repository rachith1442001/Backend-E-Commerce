const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

// Paths for the original and new Excel files
const inputFilePath = path.join(__dirname, 'input.xlsx');
const outputFilePath = path.join(__dirname, 'output.xlsx');

// Read the Excel file
const inputWorkbook = xlsx.readFile(inputFilePath);
const inputSheet = inputWorkbook.Sheets[inputWorkbook.SheetNames[0]];
const inputData = xlsx.utils.sheet_to_json(inputSheet, { header: 1 });

// Create a new workbook and sheet
const outputWorkbook = xlsx.utils.book_new();
const outputData = [];

// Iterate row by row and add to output data
inputData.forEach((row) => {
    outputData.push(row);
});

// Convert output data to a new worksheet and add it to the workbook
const outputSheet = xlsx.utils.aoa_to_sheet(outputData);
xlsx.utils.book_append_sheet(outputWorkbook, outputSheet, 'Sheet1');

// Write to a new Excel file
xlsx.writeFile(outputWorkbook, outputFilePath);

console.log(`Data has been written to ${outputFilePath}`);
