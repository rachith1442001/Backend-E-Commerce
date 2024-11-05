
const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();

const upload = multer({ dest: 'uploads/' });

// Regular expression to match date formats (DD-MM-YYYY)
const datePattern = /^(0?[1-9]|[12][0-9]|3[01])[-\/](0?[1-9]|1[0-2])[-\/](\d{4})$/;

app.post('/upload-excel', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const filePath = path.join(__dirname, req.file.path);
    const isExcel = req.body.isExcel === 'true';

    try {
        const workbook = xlsx.readFile(filePath);
        const sheetName = 'Master';
        const sheet = workbook.Sheets[sheetName];

        if (!sheet) {
            return res.status(400).send(`${sheetName} sheet not found.`);
        }

        const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });
        const rowDataAsStringArrays = jsonData.map(row =>
            row.map(cell => (cell !== undefined && cell !== null) ? String(cell).trim() : '')
        );

        const companyData = [];
        let currentCompany = {};

        for (let i = 0; i < rowDataAsStringArrays.length; i++) {
            const row = rowDataAsStringArrays[i];

            // Look for 'Company' header to identify a new company block
            if (row.includes('Company')) {
                // Capture the previous company if it exists
                if (currentCompany.CompanyName) {
                    companyData.push(currentCompany);
                }

                // Reset for the next company
                currentCompany = {};
                for (let j = 0; j < row.length; j++) {
                    if (row[j] === 'Company' && j > 0) {
                        currentCompany.CompanyName = row[j - 1]; // Get the CompanyName
                        break;
                    }
                }

                // Now look for the second next row to get Ticker and other data
                if (i + 2 < rowDataAsStringArrays.length) {
                    const nextRow = rowDataAsStringArrays[i + 2]; // Skip one row

                    currentCompany.Ticker = nextRow[2] || ''; // Ticker
                    currentCompany.SecurityID = nextRow[3] || ''; // Security ID
                    currentCompany.MeetingType = nextRow[4] || ''; // Meeting Type
                    currentCompany.Contested = nextRow[5] || ''; // Contested
                    currentCompany.AgendaType = nextRow[6] || ''; // Agenda Type
                    currentCompany.BallotData = []; // Initialize array for ballot data
                }
            } else if (row.includes('WSIB Vote Cast')) {
                // Check for "WSIB Vote Cast"
                // Loop to collect ballot data
                for (let j = i + 1; j < rowDataAsStringArrays.length; j++) {
                    const nextRow = rowDataAsStringArrays[j];

                    // If the next row is empty, break
                    if (nextRow.length === 0) break;

                    // Assign values to the ballot data array
                    const ballotData = {
                        BallotId: nextRow[1] || '',
                        ProposalText: nextRow[2] || '',
                        ManagementRec: nextRow[5] || '',
                        Vote: nextRow[6] || ''
                    };

                    currentCompany.BallotData.push(ballotData); // Add to BallotData array
                }
            }
        }

        // Push the last company if it exists
        if (currentCompany.CompanyName) {
            companyData.push(currentCompany);
        }

        if (isExcel) {
            const newWorkbook = xlsx.utils.book_new();
            const newSheet = xlsx.utils.json_to_sheet(companyData);
            xlsx.utils.book_append_sheet(newWorkbook, newSheet, 'Processed Data');

            const excelFilePath = path.join(__dirname, 'processed_data.xlsx');
            xlsx.writeFile(newWorkbook, excelFilePath);

            res.download(excelFilePath, (err) => {
                if (err) {
                    console.error('Error downloading file:', err);
                    return res.status(500).send('Error downloading file: ' + err.message);
                }
                setTimeout(() => {
                    fs.unlinkSync(excelFilePath);
                }, 100);
            });
        } else {
            return res.json(companyData);
        }

    } catch (err) {
        console.error('Error processing file:', err);
        return res.status(500).send('Error processing file: ' + err.message);
    } finally {
        try {
            fs.unlinkSync(filePath);
        } catch (unlinkErr) {
            console.error('Error unlinking uploaded file:', unlinkErr);
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
