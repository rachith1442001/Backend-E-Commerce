const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');

const app = express();

const upload = multer({ dest: 'uploads/' });

const findCompanyInArray = (array, companyName) => {
    return array.find(company => company.company === companyName);
};

app.post('/upload-excel', upload.single('file'), (req, res) => {
    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const allCompaniesData = [];
    let currentCompany = null;

    workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

        jsonData.forEach(row => {
            if (row[6] === "ref") {
                const companyName = row[0];
                let existingCompany = findCompanyInArray(allCompaniesData, companyName);
                
                if (!existingCompany) {
                    currentCompany = {
                        company: companyName,
                        meetingtype: null,
                        meetingDate: null,
                        country: null,
                        ticker: null,
                        proposals: []
                    };
                    allCompaniesData.push(currentCompany);
                } else {
                    currentCompany = existingCompany;
                }
            } else if (currentCompany) {
                if (row.some(cell => typeof cell === 'string' && /Meeting Date/i.test(cell))) {
                    const meetingDateCell = row.find(cell => typeof cell === 'string' && /Meeting Date/i.test(cell));
                    if (meetingDateCell) {
                        const meetingDate = meetingDateCell.replace(/.*Meeting Date:\s*/, '').trim();
                        currentCompany.meetingDate = meetingDate;
                    }
                }

                if (row.some(cell => typeof cell === 'string' && /Ticker/i.test(cell))) {
                    const tickerCell = row.find(cell => typeof cell === 'string' && /Ticker/i.test(cell));
                    if (tickerCell) {
                        const ticker = tickerCell.replace(/.*Ticker:\s*/, '').trim();
                        currentCompany.ticker = ticker;
                    }
                }

                if (row.some(cell => typeof cell === 'string' && /Country/i.test(cell))) {
                    const countryCell = row.find(cell => typeof cell === 'string' && /Country/i.test(cell));
                    if (countryCell) {
                        const country = countryCell.replace(/.*Country:\s*/, '').trim();
                        currentCompany.country = country;
                    }
                }

                if (row.some(cell => typeof cell === 'string' && /Meeting Type/i.test(cell))) {
                    const meetingTypeCell = row.find(cell => typeof cell === 'string' && /Meeting Type/i.test(cell));
                    if (meetingTypeCell) {
                        const meetingType = meetingTypeCell.replace(/.*Meeting Type:\s*/, '').trim();
                        currentCompany.meetingtype = meetingType;
                    }
                }

                // Create proposal without embedding the full currentCompany object
                const proposal = {
                    proposalNumber: row[0] || '',
                    proposalText: row[1] || '',
                    proponent: row[2] || '',
                    managementRec: row[3] || '',
                    policyRec: row[4] || '',
                    voteInstruction: row[5] || ''
                };
                currentCompany.proposals.push(proposal);
            }
        });
    });

    let flattenedData = allCompaniesData.flatMap(item => 
        item.proposals.map(proposal => ({
            company: item.company,
            meetingType: item.meetingtype,
            meetingDate: item.meetingDate,
            country: item.country,
            proposalNumber: proposal.proposalNumber,
            proposalText: proposal.proposalText,
            proponent: proposal.proponent,
            managementRec: proposal.managementRec,
            policyRec: proposal.policyRec,
            voteInstruction: proposal.voteInstruction
        }))
    );


    // Check for isExcel flag
    const isExcel = req.body.isExcel === 'true'; // Assuming isExcel is sent in the request body

    if (isExcel) {
        // Create a new workbook and add data
        const newWorkbook = xlsx.utils.book_new();
        const newWorksheet = xlsx.utils.json_to_sheet(flattenedData);
        xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, 'Data');

        // Generate the Excel file
        const excelFilePath = 'flattenedData.xlsx';
        xlsx.writeFile(newWorkbook, excelFilePath);

        // Send the Excel file as a response
        res.download(excelFilePath, (err) => {
            if (err) {
                console.error('Error downloading the file', err);
            }
            fs.unlinkSync(filePath); // Clean up the uploaded file
            fs.unlinkSync(excelFilePath); // Clean up the generated Excel file
        });
    } else {
        res.json(flattenedData); // Send the data as JSON
        fs.unlinkSync(filePath); // Clean up the uploaded file
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});



