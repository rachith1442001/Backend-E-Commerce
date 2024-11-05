const xlsx = require('xlsx');
const path = require('path');

// Load the workbook
const workbook = xlsx.readFile(path.join(__dirname, 'Data.xlsx'));

// Access Sheet1
const sheet = workbook.Sheets['Sheet1'];
if (!sheet) {
    console.log('Sheet1 not found in the Excel file.');
    return;
}

// Convert Sheet1 to JSON
const sheetData = xlsx.utils.sheet_to_json(sheet, { header: 1 });
const proposals = [["Issuer Name", "Meeting Date", "Meeting Type", "Proposal Number", "Proposal", "Proponent", "Vote Instruction", "Against Mgmt", "Voter Rationale"]];  // Header row for new sheet

// Extract and transform each row
for (let i = 1; i < sheetData.length; i++) {
    const row = sheetData[i];
    if (row) {
        const issuerName = row[0];
        const meetingDate = row[1];
        const meetingType = row[2];
        const proposalNumber = row[3];
        const proposal = row[4] ? row[4].replace(/\r?\n/g, " ").trim() : "";
        const proponent = row[5];
        const voteInstruction = row[6];
        const againstMgmt = row[7];
        const voterRationale = row[8] ? row[8].replace(/\r?\n/g, " ").trim() : "";

        // Push the transformed row data as a new row
        proposals.push([issuerName, meetingDate, meetingType, proposalNumber, proposal, proponent, voteInstruction, againstMgmt, voterRationale]);
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
