const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Set up multer to handle file uploads
const upload = multer({ dest: 'uploads/' });

app.post('/upload-excel', upload.single('file'), (req, res) => {
    try {
        // Load the uploaded Excel file
        const filePath = path.join(__dirname, req.file.path);
        const workbook = xlsx.readFile(filePath);
        let response = [];
        let companyData = {};

        // Define the valid meeting types
        const validMeetingTypes = ['Other', 'Annual', 'Special'];

        // Iterate through each sheet starting from the second sheet (index 1)
        workbook.SheetNames.slice(1).forEach(sheetName => { // Skip the first sheet by slicing the array
            const sheet = workbook.Sheets[sheetName];
            const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

            jsonData.forEach((row) => {
                // Check if any cell in the row contains valid meeting types
                const containsMeetingType = row.some(cell => validMeetingTypes.includes(cell));

                if (containsMeetingType) {
                    const companyName = typeof row[0] === 'string' && row[0].trim();
                    const meetingType = row[row.length - 1]; // Assuming meeting type is in the last column

                    if (companyName && meetingType) {
                        companyData = {
                            CompanyName: companyName,
                            MeetingType: meetingType
                        };
                        response.push(companyData);
                    }
                }
            });
        });

        // Cleanup the uploaded Excel file
        fs.unlinkSync(filePath);

        // Send the structured response as JSON
        res.status(200).json(response);
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ message: 'Failed to process file', error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
