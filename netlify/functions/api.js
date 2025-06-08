// @ts-nocheck
import express from 'express'
import nodemailer from 'nodemailer'
import cors from 'cors'
const router = express.Router()
import 'dotenv/config'
import serverless from 'serverless-http';


const app = express()

app.use(cors())
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
};

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


 const ApplicationEmail = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user:'jacksonprince590@gmail.com',
        // eslint-disable-next-line no-undef
        // pass: process.env.GMAIL_PASSKEY
        pass: 'wjzz gosg phnq txjo'
    }
})

ApplicationEmail.verify((error)=>{
    if(error){
        log(error)
    }else{
        log('Ready to send')
    }
})


//riders route
router.post('/riders', (req, res)=>{
     if (req.method === 'OPTIONS') {
        return {
          statusCode: 200,
          headers: CORS_HEADERS,
        };
    }
        const Data =  req.body;

        const mail = {
            from:fname,
            to:'jacksonprince590@gmail.com',
            subject:'Rider Form',
            html:`
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #f4f4f4; padding: 10px; text-align: center; }
                    .content { margin: 20px 0; }
                    .footer { margin-top: 20px; font-size: 0.8em; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>New Rider Application Received</h1>
                    </div>
                    <div class="content">
                        <p><strong>First Name:</strong> ${Data.fname}</p>
                        <p><strong>Last name:</strong> ${Data.lname}</p>
                        <p><strong>Phone number:</strong> ${Data.phone}</p>
            			<p><strong>Email:</strong> ${Data.email}</p>
            			 <p><strong>Gender:</strong> ${Data.gender}</p>
            			<p><strong>Date of birth:</strong> ${Data.DOB}</p>
                    </div>
                    <div class="footer">
                        <p>This email was sent from your virgasapp riders form.</p>
                    </div>
                </div>
            </body>
            </html>
            `,
        }

        ApplicationEmail.sendMail(mail, (error)=>{
            if(error){
                return res.json({
                    status: 'Error',
                    headers: {
                        ...CORS_HEADERS
                    }
                })
            }else{
                return res.json({
                    status: 200,
                    headers: {
                        ...CORS_HEADERS
                    }
                })
            }
        })
   
 
})

//recruit route

router.post('/jointeam', (req, res)=>{
        const Data =  req.body;

                
            const mail = {
                from:'virgasapp',
                to:'jacksonprince590@gmail.com',
                subject:'Recruit Form',
                html:`
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #f4f4f4; padding: 10px; text-align: center; }
                        .content { margin: 20px 0; }
                        .footer { margin-top: 20px; font-size: 0.8em; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>New Recruit Application Received</h1>
                        </div>
                        <div class="content">
                            <p><strong>Role:</strong> ${Data.role}</p>
                            <p><strong>motivation:</strong> ${motivation}</p>
                            <p><strong>projects:</strong> ${Data.projects}</p>
                			<p><strong>message:</strong> ${Data.message}</p>
                        </div>
                        <div class="footer">
                            <p>This email was sent from your virgasapp recruit form.</p>
                        </div>
                    </div>
                </body>
                </html>
                `,

                attachments: [
	                {
	                	filename:'Resume.pdf',
	                	path: `${Data.cv}`,
                        encoding: "base64",
	                },
                ],
            }

            ApplicationEmail.sendMail(mail, (error)=>{
                if(error){
                    return res.json({status: 'Error'})
                }else{
                    return res.json({status: 200})
                }
            })

    //Recruit Email logic here...
    
})

app.use('/.netlify/functions/api/', router)
module.exports.handler = serverless(app);
