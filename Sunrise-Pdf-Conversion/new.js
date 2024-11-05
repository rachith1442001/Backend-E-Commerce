const xlsx = require('xlsx');
const path = require('path');

// Load the workbook
const workbook = xlsx.readFile(path.join(__dirname, 'Aviva.xlsx'));

// Access Sheet1
const sheet = workbook.Sheets['Sheet1'];
if (!sheet) {
    console.log('Sheet1 not found in the Excel file.');
    return;
}

// Convert Sheet1 to JSON
const sheetData = xlsx.utils.sheet_to_json(sheet, { header: 1 });
const proposals = [["Company Name", "Meeting Type", "Meeting Date", "Country", "BallotId", "Proposal Text", "Vote", "Rationale"]];  // Header row for new sheet

// Extract and transform each row
for (let i = 1; i < sheetData.length; i++) {
    const row = sheetData[i];
    if (row) {
        const companyName = row[0];
        const meetingType = row[1];
        const meetingDate = row[2];
        const country = row[3];
        const ballotId = row[4] ? row[4].replace("Resolution ", "").trim() : "";
        const proposalText = row[5] ? row[5].replace(/\r?\n/g, " ").trim() : "";
        const vote = row[6];
        const rationale = row[7] ? row[7].replace(/\r?\n/g, " ").trim() : "";

        // Push the transformed row data as a new row
        proposals.push([companyName, meetingType, meetingDate, country, ballotId, proposalText, vote, rationale]);
    }
}

// Create a new workbook and add the transformed data as a new sheet
const newWorkbook = xlsx.utils.book_new();
const newSheet = xlsx.utils.aoa_to_sheet(proposals);
xlsx.utils.book_append_sheet(newWorkbook, newSheet, 'TransformedProposals');

// Save the new workbook to a file
const outputFilePath = path.join(__dirname, 'transformed_proposals.xlsx');
xlsx.writeFile(newWorkbook, outputFilePath);

console.log(`Transformed data has been saved to ${outputFilePath}`);
