const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = path.join(__dirname, req.file.path);

  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Only iterating over Sheet1
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    const extractedData = [];

    // Iterate over each row
    for (let i = 1; i < data.length; i++) {
      const row = data[i];

      // Skip empty rows
      if (!row[0] && !row[1] && !row[2]) {
        continue;
      }

      // Extract relevant fields
      const record = {
        CompanyName: row[0],                      // Column A
        Ticker: row[1],                           // Column B
        ISIN: row[2],                             // Column C
        Country: row[3],                          // Column D
        MeetingDate: row[4],                      // Column E
        RecordDate: row[5],                       // Column F
        MeetingType: row[6],                      // Column G
        Proponent: row[7],                        // Column H
        ProposalNumber: row[8],                   // Column I
        ProposalText: row[9],                     // Column J
        ManagementRecommendation: row[10],        // Column K
        VoteInstruction: row[11],                 // Column L
        GoldmanSachsRationale: row[12],           // Column M
      };

      // Add to extracted data
      extractedData.push(record);
    }

    // Cleanup the uploaded file
    fs.unlinkSync(filePath);

    // Send the extracted data as a JSON response
    return res.json(extractedData);

  } catch (err) {
    // Handle errors
    fs.unlinkSync(filePath);  // Clean up the uploaded file in case of error
    return res.status(500).send('Error processing file.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
