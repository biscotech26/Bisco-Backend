const transporter = require("../config/mailer");

// Allowed service options
const allowedServices = [
  "Website design & dev",
  "Branding & visual identity",
  "Digital marketing",
  "Social media management",
  "Academy / training",
  "Something else",
];

// Allowed budget options
const allowedEstimates = [
  "I'd like to discuss this",
  "Under $1,000",
  "$1,000 – $5,000",
  "$5,000+",
];

// Escape HTML to prevent HTML injection in emails
const escapeHTML = (value = "") => {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
};

const sendInquiry = async (req, res) => {
  try {
    const {
      name,
      email,
      business,
      service,
      estimate,
      project,
      website, // Honeypot field
    } = req.body;

    // Honeypot: spam protection. Real users should leave this field empty.
    if (website) {
      return res.status(200).json({
        success: true,
        message: "Thanks, we'll be in touch.",
      });
    }

    // Validation errors
    const errors = {};

    if (!name || typeof name !== "string" || !name.trim()) {
      errors.name = ["Please enter your name."];
    } else if (name.trim().length > 100) {
      errors.name = ["Name must not exceed 100 characters."];
    }

    if (!email || typeof email !== "string") {
      errors.email = ["Email is required."];
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      email.length > 254
    ) {
      errors.email = ["Enter a valid email."];
    }

    if (!service || !allowedServices.includes(service)) {
      errors.service = ["Please select a valid service."];
    }

    if (
      estimate &&
      !allowedEstimates.includes(estimate)
    ) {
      errors.estimate = ["Please select a valid budget option."];
    }

    if (!project || typeof project !== "string" || !project.trim()) {
      errors.project = ["Please describe your project."];
    } else if (project.trim().length > 10000) {
      errors.project = ["Project description is too long."];
    }

    if (
      business !== undefined &&
      (typeof business !== "string" || business.length > 150)
    ) {
      errors.business = ["Please enter a valid business name."];
    }

    // Return validation errors
    if (Object.keys(errors).length > 0) {
      return res.status(422).json({
        success: false,
        message: "Please check the form.",
        errors,
      });
    }

    // Escape user input before inserting into HTML
    const safeName = escapeHTML(name.trim());
    const safeEmail = escapeHTML(email.trim());
    const safeBusiness = escapeHTML(business || "Not provided");
    const safeService = escapeHTML(service);
    const safeEstimate = escapeHTML(estimate || "Not provided");
    const safeProject = escapeHTML(project.trim());

    // Email sent to Biscotech
    const businessEmail = {
      from: process.env.EMAIL_FROM,
      to: process.env.BUSINESS_EMAIL,

      // Allows the team to reply directly to the visitor
      replyTo: email.trim(),

      subject: `New Message - ${name.trim()}`,

      text: `
New message received from the Biscotech website.

Name: ${name.trim()}
Email: ${email.trim()}
Business: ${business || "Not provided"}
Service: ${service}
Budget: ${estimate || "Not provided"}

Project Description:
${project.trim()}
      `,

      html: `
        <h2>New Website Message</h2>

        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Business:</strong> ${safeBusiness}</p>
        <p><strong>Service:</strong> ${safeService}</p>
        <p><strong>Budget:</strong> ${safeEstimate}</p>

        <h3>Project Description</h3>
        <p>${safeProject.replace(/\r?\n/g, "<br>")}</p>

        <hr>
        <p>Sent through the Biscotech website.</p>
      `,
    };

    // Send inquiry to Biscotech
    await transporter.sendMail(businessEmail);

    // Optional visitor confirmation email
    if (process.env.SEND_CONFIRMATION === "true") {
      try{
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: email.trim(),
          subject: "We've received your message - Biscotech",

          text: `
          Hello ${name.trim()},

          Thank you for contacting Biscotech.

          We've successfully received your message and our team will get back to you.

          Best regards,
          The Biscotech Team
          `,

          html: `
            <h2>Thank you for contacting Biscotech!</h2>

            <p>Hello ${safeName},</p>

            <p>
              We've successfully received your message.
              Our team will review your message and get back to you.
            </p>

            <p>Best regards,<br>The Biscotech Team</p>
          `,
        });
      } catch (confirmationError) {
        console.error("Confirmation Email Error:", confirmationError);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Thanks, we'll be in touch.",
    });

  } catch (error) {
    console.error("Inquiry Email Error:", error);

    return res.status(500).json({
      success: false,
      message: "We couldn't send your message. Please try again.",
    });
  }
};

module.exports = { sendInquiry };