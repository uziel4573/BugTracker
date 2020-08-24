const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')
const { promisify } = require('util')

const addRowToSheet = async() => { 
    const doc = new GoogleSpreadsheet('1WjLRCNXJ_dfFNekupMfTfGME8v0KU6LyL9USizPnJuc')
    await promisify(doc.useServiceAccountAuth)(credentials)
    console.log('planilha aberta')
    const info = await promisify(doc.getInfo)()
    const worksheet = info.worksheets[0] 
    promisify( worksheet.addRow)( name: 'Roque', email: 'test')
}
addRowToSheet()


/*

doc.useServiceAccountAuth(credentials, (err) => {
    if (err) {
        console.log('nao foi possivel abrir a planilha')        
    } else {
        console.log('planilha aberta')
        doc.getInfo((err, info) => {
         const worksheet = info.worksheets[0] 
         worksheet.addRow({ name: 'Roque', email: 'test'}, err => {
             console.log('linha inserida')
         })
        })
    }
})
*/