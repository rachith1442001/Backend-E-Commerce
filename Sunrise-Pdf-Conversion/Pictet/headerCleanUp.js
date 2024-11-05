const fs = require('fs');
const xlsx = require('xlsx');

// Define the proposals array
const proposals = [
    "RESOLUTIONS IN RELATION TO THE",
    "2023 FINAL PROFIT DISTRIBUTION",
    "PLAN AND PROPOSAL OF GRANT OF",
    "AUTHORIZATION TO THE BOARD TO",
    "DETERMINE DETAILS OF THE 2024",
    "INTERIM PROFIT DISTRIBUTION PLAN",
    "SHARES",
    "Shareholder Proposals",
    "Ordinary Business",
    "Extraordinary Business",
    "Ordinary Resolutions",
    "Court-Ordered Meeting",
    "Court-Ordered Meeting For Equity Shareholders",
    "Postal Ballot",
    "Meeting for ADR Holders Ordinary Business",
    "Management Proposals",
    "Meeting for ADR Holders",
    "EGM BALLOT FOR HOLDERS OF H SHARES",
    "Series A & B Shares Have Voting Rights Where Series A Shares Must Be Mexican National to Vote",
    "Annual Meeting Agenda",
    "AGM BALLOT FOR HOLDERS OF D SHARES",
    "Ordinary Business",
    "ELECT NON-INDEPENDENT",
    "Extraordinary Business",
    "CLASS MEETING FOR HOLDERS OF H SHARES",
    "CLASS MEETING FOR HOLDERS OF H",
    "Court-Ordered Meeting for Ordinary Shareholders",
    "AGM BALLOT FOR HOLDERS OF H",
    "AGM BALLOT FOR HOLDERS OF A",
    "Elect 13 Directors by Majority Voting",
    "RESOLUTIONS IN RELATION TO THE 2023 ANNUAL WORK REPORT OF INDEPENDENT NON-EXECUTIVE DIRECTORS",
    "ELECT INDEPENDENT",
    "NON-EXECUTIVE DIRECTORS VIA",
     "CUMULATIVE VOTING",
    "PROXY CARD 1",
    "PROXY CARD 2",
    "PROXY CARD 3",
    "APPROVE SPECIFIC PLAN FOR THIS TRANSACTION",
    "APPROVE ASSET ACQUISITION BY ISSUANCE OF SHARES",
    "Please Note That You Can Only Vote “Yes” on One of the Proposals Under Below Item 9.b",
    "Shareholder Proposals Submitted by Sune Gunnarsson",
    "Management Universal Proxy (White Proxy Card) From the Combined List of Management & Dissident Nominees - Elect 12 Directors",
    "CLASS MEETING FOR HOLDERS OF A SHARES",
    "RESOLUTIONS IN RELATION TO THE 2024 SHARE REPURCHASE PLAN",
     "Management Universal Proxy (White",
     "Proxy Card)",
     "From the Combined List of",
     "Management & Dissident Nominees -",
     "Elect 13 Directors",

];

const workbook = xlsx.readFile('data.xlsx'); // Replace 'input.xlsx' with your actual Excel file name
const sheetName = workbook.SheetNames[0]; // Get the first sheet
const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]); // Convert the sheet to JSON

const beforeCount = jsonData.length;

// Filter out objects where proposalText matches any in the proposals array
const filteredOutput = jsonData.filter(item => !proposals.includes(item.proposalText));

const afterCount = filteredOutput.length;

fs.writeFile('output.json', JSON.stringify(filteredOutput, null, 2), 'utf8', (err) => {
    if (err) {
        console.error('Error writing the file:', err);
        return;
    }

    // Log counts
    console.log(`Count before removal: ${beforeCount}`);
    console.log(`Count after removal: ${afterCount}`);

    const ws = xlsx.utils.json_to_sheet(filteredOutput);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'FilteredData');

    // Write the Excel file
    xlsx.writeFile(wb, 'filtered_output.xlsx');
    console.log('Filtered data has been written to filtered_output.xlsx');
});
