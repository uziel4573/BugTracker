// BACK END
const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const { promisify } = require('util')
const sgMail = require('@sendgrid/mail')

const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')

// configuracoes
const docId = '1WjLRCNXJ_dfFNekupMfTfGME8v0KU6LyL9USizPnJuc'
const worksheetIndex = 0
const sendGridKey = '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'

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))

app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (request, response) => {
    response.render('home') 
  }) 
  app.post('/', async(request, response) => {
      try{
    const doc = new GoogleSpreadsheet(docId)
    await promisify(doc.useServiceAccountAuth)(credentials)  
    const info = await promisify( doc.getInfo)()          
    const worksheet = info.worksheets[worksheetIndex] 
    await promisify(worksheet.addRow)({
         name: request.body.name, 
         email: request.body.email,
         userAgent: request.body.userAgent,
         userDate: request.body.userDate,
         issueType: request.body.issueType,
         source: request.query.source || 'direct'
    })

    //se for critico
    
// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
if (request.body.issueType === 'CRITICAL') {
    sgMail.setApiKey(sendGridKey)
    const msg = {
      to: 'rocksj4573@gmail.com',
      from: 'rocksj4573@gmail.com',     
      subject: 'Bug critico reportado',
      text: ` 
       O ususario ${request.body.name} reportou um problema.
      `,
      html:  `O ususario ${request.body.name} reportou um problema.`,
    }
    await sgMail.send(msg)
}

    response.render('sucesso') 
} catch(err) {
    response.send('Erro aop enviar formulario.')
    console.log(err)
}
})         
    
     

app.listen(3000,(err) => {
    if (err) {
        console.log('aconteceu um erro', err)
    } else {
        console.log('bugtracker rodando na porta http://localhost:3000')
    }
})