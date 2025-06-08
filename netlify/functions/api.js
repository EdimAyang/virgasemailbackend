// @ts-nocheck
import express from 'express'
import nodemailer from 'nodemailer'
import cors from 'cors'
const router = express.Router()
import z from 'zod'
import 'dotenv/config'
import serverless from 'serverless-http';



export const RiderFormSchema = z.object({
  email: z.string().trim().optional(),
  phone: z.string().trim(),
  gender: z.string().trim().min(2, 'Please enter your gender'),
  DOB: z.string().min(2, 'Please enter your Date of birth') ,
  fname: z.string().trim().min(2, 'Please enter first name'),
  lname: z.string().trim().min(2, 'Please enter Last name'),
  
});

export const RecruitFormSchema = z.object({
  role: z.string().trim(),
  motivation: z.string().trim(),
  projects: z.string().trim(),
  message: z.string().trim() ,
  cv: z.string(),
});


const log = console.log

const app = express()

app.use(cors())

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

router.get('/hello', (req, res) =>{return  res.json({status: 'Working for get request'})})

//riders route
router.post('/riders', (req, res)=>{

        const Data =  req.body;
        const result = RiderFormSchema.parse(Data);
        const {phone , gender, DOB, fname, lname, email} = result
    

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
                        <p><strong>First Name:</strong> ${fname}</p>
                        <p><strong>Last name:</strong> ${lname}</p>
                        <p><strong>Phone number:</strong> ${phone}</p>
            			<p><strong>Email:</strong> ${email}</p>
            			 <p><strong>Gender:</strong> ${gender}</p>
            			<p><strong>Date of birth:</strong> ${DOB}</p>
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
                return res.json({status: 200})
            }
        })
   
 
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