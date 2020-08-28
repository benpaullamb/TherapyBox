const csvParse = require('csv-parse');

async function processSportData(sportCSV) {
    return await new Promise((res, rej) => {
        csvParse(sportCSV, (err, output) => {
            if(err) return rej('Failed to parse sport data');
            
            const sportData = output.map(record => {
                return {
                    date: record[1],
                    homeTeam: record[2],
                    awayTeam: record[3],
                    homeGoals: Number(record[4]),
                    awayGoals: Number(record[5]),
                    result: record[6]
                };
            });

            res(sportData);
        });
    });
}

module.exports = {
    processSportData
};