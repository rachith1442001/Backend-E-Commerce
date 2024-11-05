const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });
const MAX_TEXT_LENGTH = 32767; // Max length for Excel cell text

app.post('/upload-excel', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const filePath = path.join(__dirname, req.file.path);
    const isExcel = req.body.isExcel === 'true'; // Flag to determine if returning Excel or JSON

    try {
        const workbook = xlsx.readFile(filePath);
        const sheetName = 'Merged Data'; // Specify the sheet name
        const sheet = workbook.Sheets[sheetName];

        if (!sheet) {
            return res.status(400).send('Merged Data sheet not found.');
        }

        const jsonData = xlsx.utils.sheet_to_json(sheet); // Convert the "Merged Data" sheet to JSON

        // Initial merging logic based on COMPANY NAME and PROPOSAL NUMBER
        const mergedData = [];
        jsonData.forEach((current) => {
            const proposalNumber = current["PROPOSAL NUMBER"];
            if (!proposalNumber) {
                const previous = mergedData[mergedData.length - 1];
                if (previous) {
                    // Merge all available fields
                    for (const key in current) {
                        if (current[key]) { // Check if current[key] has a value
                            if (previous[key] && typeof previous[key] === 'string' && !previous[key].includes(current[key])) {
                                previous[key] += ' ' + current[key]; // Append value if not already present
                                // Truncate if length exceeds maximum
                                if (previous[key].length > MAX_TEXT_LENGTH) {
                                    previous[key] = previous[key].substring(0, MAX_TEXT_LENGTH);
                                }
                            } else if (!previous[key]) {
                                previous[key] = current[key]; // Assign if empty
                                // Truncate if length exceeds maximum
                                if (previous[key].length > MAX_TEXT_LENGTH) {
                                    previous[key] = previous[key].substring(0, MAX_TEXT_LENGTH);
                                }
                            }
                        }
                    }
                }
            } else {
                mergedData.push({ ...current }); // Push if PROPOSAL NUMBER is present
            }
        });

        // Final merging logic: Push objects with non-empty PROPOSAL NUMBER
        const finalMergedData = [];
        mergedData.forEach(current => {
            const proposalNumber = current["PROPOSAL NUMBER"];
            if (proposalNumber) {
                finalMergedData.push({ ...current }); // Push if PROPOSAL NUMBER is not empty
            }
        });

        // Ensure text length is within Excel limits before exporting
        finalMergedData.forEach(item => {
            for (const key in item) {
                if (typeof item[key] === 'string' && item[key].length > MAX_TEXT_LENGTH) {
                    item[key] = item[key].substring(0, MAX_TEXT_LENGTH); // Truncate to MAX_TEXT_LENGTH
                }
            }
        });

        if (isExcel) {
            // Convert JSON data back to Excel
            const newWorkbook = xlsx.utils.book_new();
            const newSheet = xlsx.utils.json_to_sheet(finalMergedData);

            if (finalMergedData.length === 0) {
                return res.status(400).send('No data available to convert to Excel.');
            }

            xlsx.utils.book_append_sheet(newWorkbook, newSheet, 'Merged Data');
            const excelFilePath = path.join(__dirname, 'processed_data.xlsx');
            xlsx.writeFile(newWorkbook, excelFilePath);

            // Send the Excel file for download
            res.download(excelFilePath, (err) => {
                if (err) {
                    console.error('Error downloading file:', err);
                    return res.status(500).send('Error downloading file: ' + err.message);
                }
                // Use a delayed unlink after sending the response
                setTimeout(() => {
                    fs.unlinkSync(excelFilePath);
                }, 100); // Delay in milliseconds
            });
        } else {
            // Return JSON response if 'isExcel' flag is not true
            return res.json(finalMergedData);
        }

    } catch (err) {
        console.error('Error processing file:', err);
        return res.status(500).send('Error processing file: ' + err.message);
    } finally {
        // Ensure the uploaded file is deleted in case of error
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
