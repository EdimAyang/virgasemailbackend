// @ts-nocheck
import express from 'express'
import nodemailer from 'nodemailer'
import cors from 'cors'
import 'dotenv/config'
import serverless from 'serverless-http';
// import bodyParser from 'body-parser'


const app = express()
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }))
app.use(cors({origin:'*'}))
const router = express.Router()

 const ApplicationEmail = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user:'jacksonprince590@gmail.com',
        // eslint-disable-next-line no-undef
        pass: process.env.GMAIL_PASSKEY
       
    }
})

// ApplicationEmail.verify((error)=>{
    // if(error){
        // log(error)
    // }else{
        // log('Ready to send')
    // }
// })


//riders route
router.post('/riders', (req, res)=>{
    let name = req.body.name;

        const mail = {
            from:name,
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
                        <p><strong>First Name:</strong>${name}</p>
                        <p><strong>Last name:</strong> ${req.body.name2}</p>
                        <p><strong>Phone number:</strong> ${req.body.phone}</p>
            			<p><strong>Email:</strong> ${req.body.email}</p>
            			 <p><strong>Gender:</strong> ${req.body.gender}</p>
            			<p><strong>Date of birth:</strong> ${req.body.DOB}</p>
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
                return res.json({status: 'Error'})
            }else{
                return res.json({status: `200`})
            }
        })
        // return res.json("hello")
})

//recruit route

router.post('/jointeam', (req, res)=>{


        const Data2 =  req.body;
        const result = RecruitFormSchema.parse(Data2)
        const {role, message, projects, motivation ,cv} = result

                
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
                            <p><strong>Role:</strong> ${role}</p>
                            <p><strong>motivation:</strong> ${motivation}</p>
                            <p><strong>projects:</strong> ${projects}</p>
                			<p><strong>message:</strong> ${message}</p>
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
	                	path: cv,
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

// app.listen(3000, ()=>{log('server running')})