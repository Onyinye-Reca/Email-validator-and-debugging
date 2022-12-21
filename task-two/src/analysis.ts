/**
 * First task - Read the csv files in the inputPath and analyse them
 *
 * @param {string[]} inputPaths An array of csv files to read
 * @param {string} outputPath The path to output the analysis
 */
const fs = require('fs');
const validator = require('email-validator')

function analyseFiles(inputPaths: string [], outputPath: string) {
  let validEmails: string [] = [];
  let validDomain: string [] = [];
  let validDomainObj: {[key: string]: number} = {};
  let validEmailsObj: {[key: string]: number} = {};
  let totalValidEmails = 0;
  let chunk = "";

  const streamsData = fs.createReadStream(inputPaths[0])
  const writeData = fs.createWriteStream(outputPath)

  streamsData.on('data', (data: string) =>{
    chunk += data
  })

  streamsData.on('end', () => {
    let processedEmails = chunk.split('\n')

    processedEmails.forEach(value => {
      if(validator.validate(value)){
        validEmails.push(value)

        let validEmailDomain = value.split('@')[1];
        validDomain.push(validEmailDomain)
      }
      if(value !== "" && value !== 'Emails'){
        totalValidEmails++
      }
    })

    for(let domains of validDomain){
      if(validDomainObj[domains]) {
       validDomainObj[domains] += 1;
      }else{
        validDomainObj[domains] = 1
      }
    }

    for(let emails of validEmails){
      let castEmail = String(emails)
      if(validEmailsObj[castEmail]) {
        validEmailsObj[castEmail] += 1;
        }else{
        validEmailsObj[castEmail] = 1
        }
    }

    let outputObj = {
      "valid-domains": Object.keys( validDomainObj),
      "totalEmailsParsed": totalValidEmails,
      "totalValidEmails": validEmails.length,
      "categories": validDomainObj
    }

    const result = JSON.stringify(outputObj, null, " ")
    writeData.write(result)
    writeData.end()

    writeData.on('finish', () => {
      console.log('finished writing file')
    })
  })
}

analyseFiles(['./fixtures/inputs/small-sample.csv'] , 'report-analysis.json')
export default analyseFiles;
