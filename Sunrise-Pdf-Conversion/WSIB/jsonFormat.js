const fs = require('fs');
const path = require('path');

// Define the path to your JSON file
const jsonFilePath = path.join(__dirname, 'output.json'); // replace 'yourFileName.json' with the actual filename
const outputFilePath = path.join(__dirname, 'data.json'); // Output file path

// Read the JSON file
fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    // Parse the JSON data
    let jsonData;
    try {
        jsonData = JSON.parse(data);
    } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        return;
    }

    // Transform the data
    const transformedData = jsonData.flatMap(company => {
        // Check if BallotData exists and is an array
        if (Array.isArray(company.BallotData)) {
            return company.BallotData.map(ballot => ({
                CompanyName: company.CompanyName,
                Ticker: company.Ticker,
                SecurityID: company.SecurityID,
                MeetingType: company.MeetingType,
                Contested: company.Contested,
                AgendaType: company.AgendaType,
                ...ballot // Spread the ballot data
            }));
        } else {
            console.warn(`No BallotData found for company: ${company.CompanyName}`);
            return []; // Return an empty array if no BallotData exists
        }
    });

    // Write the transformed data to a new JSON file
    fs.writeFile(outputFilePath, JSON.stringify(transformedData, null, 2), (writeErr) => {
        if (writeErr) {
            console.error('Error writing to file:', writeErr);
            return;
        }
        console.log('Transformed data has been written to data.json');
    });
});
