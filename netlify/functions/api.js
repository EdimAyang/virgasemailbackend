// @ts-nocheck
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import nodemailer from "nodemailer";
import multer from "multer";
import serverless from "serverless-http";

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ======================================================
// CORS
// ======================================================

const allowedOrigins = ["https://virgasapp.com", "https://www.virgasapp.com", "http://localhost:5173/"];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  );

  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  res.header("Access-Control-Allow-Credentials", "false");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

const router = express.Router();

const ApplicationEmail = nodemailer.createTransport({
  service: process.env.SERVICE,
  auth: {
    user: process.env.EMAIL,
    // eslint-disable-next-line no-undef
    pass: process.env.GMAIL_PASSKEY,
  },
});

// ======================================================
// SUPPORT IMAGE UPLOAD
// ======================================================

const supportUpload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },

  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/png", "image/jpeg"];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PNG and JPG/JPEG images are allowed."));
    }
  },
});

// ======================================================
// RIDERS ROUTE
// ======================================================

router.post("/riders", async (req, res) => {
  try {
    const { fname, lname, email, phone, DOB, gender } = req.body;

    // ------------------------------------------
    // Validation
    // ------------------------------------------

    if (!fname || !lname || !email || !phone || !DOB || !gender) {
      return res.status(400).json({
        status: "Error",
        message: "All rider fields are required.",
      });
    }

    // ------------------------------------------
    // Email
    // ------------------------------------------

    const mail = {
      from: "virgasapp",
      to: "mephaltihqrecruitment@gmail.com",
      subject: "Rider Form",

      html: `
                <!DOCTYPE html>

                <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                line-height: 1.6;
                            }

                            .container {
                                max-width: 600px;
                                margin: 0 auto;
                                padding: 20px;
                            }

                            .header {
                                background-color: #f4f4f4;
                                padding: 10px;
                                text-align: center;
                            }

                            .content {
                                margin: 20px 0;
                            }

                            .footer {
                                margin-top: 20px;
                                font-size: 0.8em;
                                color: #666;
                            }
                        </style>
                    </head>

                    <body>
                        <div class="container">

                            <div class="header">
                                <h1>
                                    New Rider Application Received
                                </h1>
                            </div>

                            <div class="content">

                                <p>
                                    <strong>First Name:</strong>
                                    ${fname}
                                </p>

                                <p>
                                    <strong>Last Name:</strong>
                                    ${lname}
                                </p>

                                <p>
                                    <strong>Phone Number:</strong>
                                    ${phone}
                                </p>

                                <p>
                                    <strong>Email:</strong>
                                    ${email}
                                </p>

                                <p>
                                    <strong>Gender:</strong>
                                    ${gender}
                                </p>

                                <p>
                                    <strong>Date of Birth:</strong>
                                    ${DOB}
                                </p>

                            </div>

                            <div class="footer">
                                <p>
                                    This email was sent from your
                                    Virgas App riders form.
                                </p>
                            </div>

                        </div>
                    </body>
                </html>
            `,
    };

    await ApplicationEmail.sendMail(mail);

    return res.status(200).json({
      status: "200",
      message: "Rider application sent successfully.",
    });
  } catch (error) {
    console.error("Rider email error:", error);

    return res.status(500).json({
      status: "Error",
      message: "Failed to send rider application.",
    });
  }
});

// ======================================================
// JOIN TEAM ROUTE
// ======================================================

router.post("/jointeam", async (req, res) => {
  try {
    const { role, message, projects, motivation, cv } = req.body;

    // ------------------------------------------
    // Validation
    // ------------------------------------------

    if (!role || !message || !projects || !motivation || !cv) {
      return res.status(400).json({
        status: "Error",
        message: "All recruitment fields are required.",
      });
    }

    // ------------------------------------------
    // Email
    // ------------------------------------------

    const mail = {
      from: "virgasapp",
      to: "mephaltihqrecruitment@gmail.com",
      subject: "Recruit Form",

      html: `
                <!DOCTYPE html>

                <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                line-height: 1.6;
                            }

                            .container {
                                max-width: 600px;
                                margin: 0 auto;
                                padding: 20px;
                            }

                            .header {
                                background-color: #f4f4f4;
                                padding: 10px;
                                text-align: center;
                            }

                            .content {
                                margin: 20px 0;
                            }

                            .footer {
                                margin-top: 20px;
                                font-size: 0.8em;
                                color: #666;
                            }
                        </style>
                    </head>

                    <body>
                        <div class="container">

                            <div class="header">
                                <h1>
                                    New Recruit Application Received
                                </h1>
                            </div>

                            <div class="content">

                                <p>
                                    <strong>Role:</strong>
                                    ${role}
                                </p>

                                <p>
                                    <strong>Motivation:</strong>
                                    ${motivation}
                                </p>

                                <p>
                                    <strong>Projects:</strong>
                                    ${projects}
                                </p>

                                <p>
                                    <strong>Message:</strong>
                                    ${message}
                                </p>

                            </div>

                            <div class="footer">
                                <p>
                                    This email was sent from your
                                    Virgas App recruitment form.
                                </p>
                            </div>

                        </div>
                    </body>
                </html>
            `,

      attachments: [
        {
          filename: "Resume.pdf",
          path: cv,
          encoding: "base64",
        },
      ],
    };

    await ApplicationEmail.sendMail(mail);

    return res.status(200).json({
      status: "200",
      message: "Recruitment application sent successfully.",
    });
  } catch (error) {
    console.error("Recruitment email error:", error);

    return res.status(500).json({
      status: "Error",
      message: "Failed to send recruitment application.",
    });
  }
});

// ======================================================
// SUPPORT ROUTE
// ======================================================

router.post(
  "/support",
  supportUpload.single("attachment"),
  async (req, res) => {
    try {
      const { Topic, message } = req.body;

      // ------------------------------------------
      // Validation
      // ------------------------------------------

      if (!Topic || !message) {
        return res.status(400).json({
          status: "Error",
          message: "Topic and message are required.",
        });
      }

      // ------------------------------------------
      // Email
      // ------------------------------------------

      const mail = {
        from: "virgasapp",
        to: "support@virgasapp.com",
        subject: `Support Request: ${Topic}`,

        html: `
                    <!DOCTYPE html>

                    <html>
                        <head>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    line-height: 1.6;
                                }

                                .container {
                                    max-width: 600px;
                                    margin: 0 auto;
                                    padding: 20px;
                                }

                                .header {
                                    background-color: #f4f4f4;
                                    padding: 10px;
                                    text-align: center;
                                }

                                .content {
                                    margin: 20px 0;
                                }

                                .message {
                                    background-color: #f9f9f9;
                                    padding: 15px;
                                    border-radius: 5px;
                                    white-space: pre-wrap;
                                }

                                .footer {
                                    margin-top: 20px;
                                    font-size: 0.8em;
                                    color: #666;
                                }
                            </style>
                        </head>

                        <body>
                            <div class="container">

                                <div class="header">
                                    <h1>
                                        New Support Request
                                    </h1>
                                </div>

                                <div class="content">

                                    <p>
                                        <strong>Topic:</strong>
                                        ${Topic}
                                    </p>

                                    <p>
                                        <strong>Message:</strong>
                                    </p>

                                    <div class="message">
                                        ${message}
                                    </div>

                                </div>

                                <div class="footer">
                                    <p>
                                        This email was sent from the
                                        Virgas App support form.
                                    </p>
                                </div>

                            </div>
                        </body>
                    </html>
                `,

        ...(req.file && {
          attachments: [
            {
              filename: req.file.originalname,
              content: req.file.buffer,
              contentType: req.file.mimetype,
            },
          ],
        }),
      };

      await ApplicationEmail.sendMail(mail);

      return res.status(200).json({
        status: "200",
        message: "Support request sent successfully.",
      });
    } catch (error) {
      console.error("Support email error:", error);

      return res.status(500).json({
        status: "Error",
        message: "Failed to send support request.",
      });
    }
  },
);

// ======================================================
// ROUTER
// ======================================================

app.use("/.netlify/functions/api/", router);

export const handler = serverless(app);
