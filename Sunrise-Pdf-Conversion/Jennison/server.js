const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Endpoint to upload and process the Excel file
app.post('/upload-excel', upload.single('file'), (req, res) => {
    // Check if the file was uploaded
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        // Get the file path
        const filePath = path.join(__dirname, req.file.path);
        const workbook = xlsx.readFile(filePath);

        let response = [];
        let headers = [];
        let companyData = {};
        let lastProposal = null;

        // Get all sheet names and process only specific ones (sheet234 and sheet235)
        const targetSheets = ['Sheet628', 'Sheet629'];

        targetSheets.forEach(sheetName => {
            const sheet = workbook.Sheets[sheetName];
            const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });
console.log(jsonData);

            jsonData.forEach((row) => {
                if (row.some(cell => typeof cell === 'string' && cell.includes('Proxy Voting Summary Report Date'))) {
                    return; // Skip this row if it contains the "Proxy Voting Summary Report Date"
                }

                // Extract CompanyName and MeetingType
                if (row.some(cell => cell === 'Annual' || cell === 'Special' || cell === 'Mix' || cell === 'Other')) {
                    companyData.CompanyName = row[0];
                    companyData.MeetingType = row.find(cell => cell === 'Annual' || cell === 'Special' || cell === 'Mix' || cell === 'Other');
                }

                // Extract fields like ISIN, Meeting Date, etc.
                const fields = ['ISIN', 'Meeting Date', 'Contested', 'Country', 'Record Date', 'Ballot Status', 'Ballot SecID'];
                fields.forEach(field => {
                    if (row.includes(field)) {
                        companyData[field] = row[row.indexOf(field) + 1] || '';
                    }
                });

                // Extract Proposal section
                if (row[0] === 'Number' && row[1] === 'Proposal') {
                    headers = row.map(header => header.trim()); // Trim headers to remove extra spaces
                } else if (headers.length > 0) {
                    if (row[0] && row[0] !== 'Proposal') {
                        let proposal = {};
                        headers.forEach((header, idx) => {
                            if (header === 'Mgmt Rec') {
                                header = 'MgmtRec'; 
                            }

                            const value = row[idx] !== undefined ? String(row[idx]).trim() : '';

                            proposal[header] = value || ''; 
                        });

                        // Check if all required fields are empty
                        const requiredFields = ["Number", "Proposal", "Proponent", "MgmtRec", "Vote", "Mgmt"];
                        const allRequiredFieldsEmpty = requiredFields.every(field => !proposal[field]);

                        if (allRequiredFieldsEmpty) {
                            console.warn('Warning: All required fields are empty for a proposal');
                            return; // Skip this entry
                        }

                        // Add the company data and proposal data
                        lastProposal = {
                            CompanyName: companyData.CompanyName,
                            MeetingType: companyData.MeetingType, // Include MeetingType
                            ISIN: companyData.ISIN,
                            'Meeting Date': companyData['Meeting Date'],
                            Contested: companyData.Contested,
                            Country: companyData.Country,
                            'Record Date': companyData['Record Date'],
                            'Ballot Status': companyData['Ballot Status'],
                            'Ballot SecID': companyData['Ballot SecID'],
                            ...proposal
                        };
                        response.push(lastProposal);
                    } else if (!row[0] && row[1] && lastProposal) {
                        lastProposal.Proposal += ` ${String(row[1]).trim()}`;
                    }
                }
            });
        });

        // Delete the uploaded file after processing
        fs.unlinkSync(filePath);

        
        const filteredResponse = response.filter(item => {
            const numberValue = String(item.Number).trim();
            
            const startsWithDigitAndEndsWithPeriod = /^\d.*\.$/.test(numberValue);
            
            const isValidIntegerFloat = !isNaN(parseFloat(numberValue)) && isFinite(numberValue);
            
            const startsWithDigitAndHasAlphanumericSuffix = /^\d+(\.\w+)?$/.test(numberValue);
            
            const startsWithDigitAndHasHyphenAndDigits = /^\d+-\d+$/.test(numberValue);
            
            
            const startsWithLetterAndHasNumberSuffix = /^[A-Za-z]+\d+(\.\d+)?$/.test(numberValue);
            
            
            return startsWithDigitAndEndsWithPeriod || isValidIntegerFloat || 
                   startsWithDigitAndHasAlphanumericSuffix || startsWithDigitAndHasHyphenAndDigits ||
                   startsWithLetterAndHasNumberSuffix; 
        });
        
                
        console.log(filteredResponse.length);

        // Send the filtered response
        res.status(200).json(response);
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ message: 'Failed to process file', error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
