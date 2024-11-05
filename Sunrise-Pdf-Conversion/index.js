const xlsx = require('xlsx');
const path = require('path');

// Load the workbook
const workbook = xlsx.readFile(path.join(__dirname, 'Aviva.xlsx'));

// Access Sheet2
const sheet = workbook.Sheets['Sheet2'];
if (!sheet) {
    console.log('Sheet2 not found in the Excel file.');
    return;
}

// Convert Sheet2 to JSON
const sheetData = xlsx.utils.sheet_to_json(sheet, { header: 1 });
const proposals = [["ballotId", "proposalText"]];  // Header row for new sheet

// Extract and transform each proposalText
for (let i = 1; i < sheetData.length; i++) {
    const proposalText = sheetData[i][0];
    if (proposalText) {
        // Remove "Resolution" from ballotId
        const [rawBallotId, ...textParts] = proposalText.split('. ');
        const ballotId = rawBallotId.replace("Resolution ", "").trim();
        
        // Remove newline characters from proposal text
        const proposalTextCleaned = textParts.join('. ').replace(/\r?\n/g, " ").trim();

        // Push the transformed data as a new row
        proposals.push([ballotId, proposalTextCleaned]);
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
