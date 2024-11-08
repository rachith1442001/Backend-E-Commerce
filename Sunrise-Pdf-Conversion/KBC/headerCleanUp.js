const fs = require('fs');
const xlsx = require('xlsx');

// Define the proposals array
const proposals =[
    "Ordinary Business",
    "Extraordinary Business",
    "Postal Ballot",
    "Extraordinary Meeting Agenda",
    "Annual Meeting Agenda",
    "Court Meeting",
    "Ordinary Shareholders' Meeting",
    "Extraordinary General Meeting Agenda",
    "Extraordinary Shareholders' Meeting",
    "APPROVE 2022 RELATED PARTY",
    "APPROVE 2023 RELATED PARTY",
    "ELECT NON-INDEPENDENT",
    "ELECT NON-INDEPENDENT",
    "ELECT INDEPENDENT DIRECTORS VIA",
    "ELECT SUPERVISORS VIA",
    "ELECT SUPERVISORS VIA",
    "CLASS MEETING FOR HOLDERS OF H",
    "Annual General Meeting Agenda",
    "RESOLUTIONS IN RELATION TO THE",
    "RESOLUTIONS IN RELATION TO THE",
    "RESOLUTIONS IN RELATION TO THE",
    "RESOLUTIONS IN RELATION TO THE",
    "RESOLUTIONS IN RELATION TO THE",
    "RESOLUTIONS IN RELATION TO THE",
    "RESOLUTIONS IN RELATION TO THE",
    "RESOLUTIONS IN RELATION TO THE",
    "AGM BALLOT FOR HOLDERS OF H",
    "SPECIAL RESOLUTIONS",
    "ORDINARY RESOLUTIONS",
    "ELECT EXECUTIVE DIRECTORS AND",
    "ELECT INDEPENDENT",
    "ELECT INDEPENDENT",
    "RESOLUTIONS REGARDING",
    "Shareholder Proposal Submitted by",
    "Shareholder Proposal Submitted by",
    "Shareholder Proposal Submitted by",
    "Shareholder Proposal Submitted by",
    "Shareholder Proposal Submitted by",
    "Shareholder Proposal Submitted by",
    "Shareholder Proposal Submitted by",
    "Shareholder Proposal Submitted by",
    "Shareholder Proposal Submitted by",
    "Shareholder Proposal Submitted by",
    "Shareholder Proposal Submitted by",
    "Shareholder Proposal Submitted by",
    "Shareholder Proposal Submitted by",
    "Shareholder Proposal Submitted by",
    "Management Proposals",
    "Shareholder Proposals Submitted by",
    "Shareholder Proposals Submitted by",
    "Shareholder Proposals Submitted by",
    "Shareholder Proposals Submitted by",
    "Shareholder Proposals Submitted by",
    "Shareholder Proposals Submitted by",
    "Shareholder Proposals Submitted by",
    "Shareholder Proposals Submitted by",
    "Shareholder Proposals Submitted by",
    "Shareholder Proposals Submitted by",
    "Shareholder Proposals Submitted by",
    "Shareholder Proposals Submitted by",
    "Shareholder Proposals Submitted by",
    "Shareholder Proposals Submitted by",
    "Appoint Directors (Slate election) -",
    "Appoint Internal Statutory Auditors",
    "Appoint Internal Statutory Auditors",
    "MEETING FORMALITY",
    "AGENDA ITEMS",
    "Shareholder Proposals",
    "Meeting for Holders of Units",
    "If Voting FOR on Item 7, Votes Are",
    "Candidates Proposed by Company's",
    "Candidates Proposed by Shareholders:",
    "Elect 10 Directors by Cumulative",
    "Ordinary and Extraordinary General",
    "Elect 11 Directors by Cumulative",
    "If Voting FOR on Item 6, Votes Are",
    "Elect Director",
    "Shareholder Proposal Submitted by De",
    "Shareholder Proposal",
    "Annual/Special Meeting Agenda",
    "Extraordinary Shareholders Meeting",
    "Vote on Items #4 and #5 Only If You",
    "Shareholder Proposal Submitted by SQ",
    "Ordinary General Meeting Agenda",
    "Shareholder Proposal Submitted by GC",
    "Management Proposal",
    "Ordinary Part",
    "Special Part",
    "Annual Shareholders' Meeting Agenda",
    "Special Shareholders' Meeting Agenda",
    "If Voting FOR on Item 3, Votes Are",
    "If Voting FOR on Item 12, Votes Are",
    "Annual/Special Meeting",
    "Extraordinary Part",
    "Extraordinary General Shareholders'",
    "Special Meeting Agenda",
    "Ordinary Meeting Agenda",
    "Meeting for Class B Subordinate Voting",
    "Meeting for Class A Variable Voting",
    "Annual General Meeting",
    "Annual Shareholders' General Meeting",
    "Extraordinary Shareholders' General",
    "APPROVE CONVERTIBLE BONDS",
    "ELECT DIRECTORS VIA CUMULATIVE",
    "Management Universal Proxy (White",
    "From the Combined List of",
    "Dissident Universal Proxy (Gold Proxy",
    "ELECT INDEPENDENT DIRECTOR VIA",
    "ELECT SUPERVISOR VIA CUMULATIVE",
    "AGM BALLOT FOR HOLDERS OF",
    "SPECIAL RESOLUTION",
    "ELECT DIRECTORS",
    "ELECT SUPERVISORS",
    "RESOLUTIONS IN RELATION TO",
    "ELECT NON-EXECUTIVE DIRECTOR",
    "AGM BALLOT FOR HOLDERS OF A",
    "Dissident Universal Proxy (Blue Proxy",
    "Politan Nominees",
    "Company Nominees Opposed by",
    "Meeting for Class A Subordinate Voting",
    "ELECT EXECUTIVE DIRECTORS VIA",
    "Elect Directors by Cumulative Voting",
    "Ordinary Resolution",
    "Court-Ordered Meeting",
    "Resolutions for Transurban Holdings",
    "Resolutions for Transurban Holdings",
    "Resolutions for Vicinity Limited (the",
    "Resolution for Vicinity Limited (the",
    "Agenda",
    "TRANSACTIONS OF WESTERN MINING",
    "DIRECTORS AND INDEPENDENT",
    "CUMULATIVE VOTING",
    "ACCUMULATIVE VOTING",
    "ISSUANCE AND ADMISSION OF GDRS",
    "NON-PUBLIC ISSUANCE OF A SHARES",
    "REMUNERATION OF DIRECTORS AND",
    "2023 ANNUAL ESTIMATION FOR",
    "AkademikerPension and LD Fonde",
    "Banco BPM SpA",
    "Carl Zeiss AG",
    "Roma Capitale",
    "Double R Srl",
    "Institutional Investors (Assogestioni)",
    "Marzotto Spa and Faber Five Srl",
    "Cremonini SpA",
    "Technologies SapA di FDS ss",
    "U.T. Communications SpA",
    "CDP Reti SpA",
    "Ministry of Economy and Finance",
    "Presa SpA and Fimedi SpA",
    "Marco Polo International Italy Srl and",
    "Shareholders",
    "Annual/Special Meeting",
    "Extraordinary General Shareholders'"
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
