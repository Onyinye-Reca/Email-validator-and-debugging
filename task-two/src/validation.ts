/**
 * Stretch goal - Validate all the emails in this files and output the report
 *
 * @param {string[]} inputPath An array of csv files to read
 * @param {string} outputFile The path where to output the report
 */

 const fs = require('fs');
 const validator = require('email-validator')


function validateEmailAddresses(inputPath: string[], outputFile: string) {
  let validEmails: string [] = ['Emails'];
  let chunk = "";

  const streamsData = fs.createReadStream(inputPath[0])
  const writeData = fs.createWriteStream(outputFile)

  streamsData.on('data', (data: string) =>{
    chunk += data
  })

  streamsData.on('end', () => {
    let processedEmails = chunk.split('\n')

    processedEmails.forEach(value => {
      if(validator.validate(value)){
        validEmails.push(value)
      }
    })

    const newEmail = validEmails.join('\n')

    writeData.write(newEmail)
    writeData.end()

    writeData.on('finish', () => {
      console.log('finished writing file')
    })
})
}
//console.log(validateEmailAddresses(['/Users/decagon/ Task 4/week-4-task-Onyinye-Reca/task-two/fixtures/inputs/medium-sample.csv'] , 'medium-report-validation.csv'))
export default validateEmailAddresses;
