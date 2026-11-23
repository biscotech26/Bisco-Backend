
const schemas = {
  InquiryRequest: {
    type: "object",
    required: ["name", "email", "service", "project"],
    properties: {
      name: {
        type: "string",
        example: "Divine",
      },
      email: {
        type: "string",
        format: "email",
        example: "customer@example.com",
      },
      business: {
        type: "string",
        example: "ABC Technologies",
        description: "Optional business name",
      },
      service: {
        type: "string",
        enum: [
          "Website design & dev",
          "Branding & visual identity",
          "Digital marketing",
          "Social media management",
          "Academy / training",
          "Something else",
        ],
        example: "Website design & dev",
      },
      estimate: {
        type: "string",
        enum: [
          "I'd like to discuss this",
          "Under $1,000",
          "$1,000 – $5,000",
          "$5,000+",
        ],
        example: "Under $1,000",
        description: "Optional project budget estimate",
      },
      project: {
        type: "string",
        example: "I need a website for my business.",
      },
      website: {
        type: "string",
        example: "",
        description:
          "Honeypot field for spam detection. Leave empty when submitting normally.",
      },
    },
  },

  InquirySuccess: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      message: {
        type: "string",
        example: "Thanks, we'll be in touch.",
      },
    },
  },

  ValidationError: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: false,
      },
      message: {
        type: "string",
        example: "Please re-check the form.",
      },
      errors: {
        type: "object",
        additionalProperties: {
          type: "string",
        },
        example: {
          email: "Please provide a valid email address.",
        },
      },
    },
  },

  ErrorResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: false,
      },
      message: {
        type: "string",
        example: "Something went wrong. Please try again later.",
      },
    },
  },
};

module.exports = schemas;
