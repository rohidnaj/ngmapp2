"use server"
import { contactFormSchema, quoteFormSchema } from "@/lib/validations"
import { Resend } from "resend"
import { sendDiscordNotification, sendEmailNotification } from "@/lib/notifications"
import fs from 'fs'
import path from 'path'

// Initialize Resend with better error handling
let resend: Resend
try {
  resend = new Resend(process.env.RESEND_API_KEY)
  console.log("Resend initialized successfully")
} catch (error) {
  console.error("Failed to initialize Resend:", error)
  resend = {} as Resend // Fallback empty object to prevent runtime errors
}

// Path to store the content data file
const CONTENT_FILE_PATH = path.join(process.cwd(), 'data', 'content.json')

// Ensure the data directory exists
try {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
    console.log("Created data directory")
  }
} catch (error) {
  console.error("Error creating data directory:", error)
}

// Save content to server file
export async function saveContentToServer(content: any) {
  try {
    // Make sure the directory exists
    const dataDir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    
    // Write content to file
    fs.writeFileSync(CONTENT_FILE_PATH, JSON.stringify(content, null, 2))
    console.log("Content saved to server file")
    
    return { success: true, message: "Content saved successfully" }
  } catch (error) {
    console.error("Error saving content to server file:", error)
    return { success: false, message: "Error saving content" }
  }
}

// Load content from server file
export async function loadContentFromServer() {
  try {
    // Check if file exists
    if (!fs.existsSync(CONTENT_FILE_PATH)) {
      console.log("Content file does not exist yet")
      return { success: false, message: "Content file does not exist" }
    }
    
    // Read content from file
    const contentData = fs.readFileSync(CONTENT_FILE_PATH, 'utf8')
    const content = JSON.parse(contentData)
    console.log("Content loaded from server file")
    
    return { success: true, content }
  } catch (error) {
    console.error("Error loading content from server file:", error)
    return { success: false, message: "Error loading content" }
  }
}

export async function submitContactForm(prevState: any, formData: FormData) {
  try {
    // Extract form data
    const values = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    }

    // Validate form data
    const validatedFields = contactFormSchema.safeParse(values)

    // Return early if validation fails
    if (!validatedFields.success) {
      return {
        status: "error",
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Invalid form data. Please check the fields and try again.",
      }
    }

    // Log the form submission for debugging
    console.log("Processing contact form submission:", validatedFields.data)

    // Prepare notification content
    const emailHtml = `
    <h1>New Contact Form Submission</h1>
    <p><strong>Name:</strong> ${validatedFields.data.name}</p>
    <p><strong>Email:</strong> ${validatedFields.data.email}</p>
    <p><strong>Message:</strong> ${validatedFields.data.message}</p>
  `

    const discordMessage = `📬 **New Contact Form Submission**
Name: ${validatedFields.data.name}
Email: ${validatedFields.data.email}
Message: ${validatedFields.data.message}`

    // Send notifications
    let emailSent = false
    let discordSent = false

    // Send email notification
    emailSent = await sendEmailNotification(resend, "info@ngmlandscape.ca", "New Contact Form Submission", emailHtml)

    // Send Discord notification
    discordSent = await sendDiscordNotification(discordMessage)

    // Log notification status
    console.log("Notification status - Email:", emailSent, "Discord:", discordSent)

    return {
      status: "success",
      message: "Thank you for your message! We will get back to you soon.",
    }
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return {
      status: "error",
      message: "Something went wrong. Please try again later.",
    }
  }
}

export async function submitQuoteForm(prevState: any, formData: FormData) {
  try {
    // Extract form data
    const values = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      service: formData.get("service"),
      details: formData.get("details"),
    }

    // Validate form data
    const validatedFields = quoteFormSchema.safeParse(values)

    // Return early if validation fails
    if (!validatedFields.success) {
      return {
        status: "error",
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Invalid form data. Please check the fields and try again.",
      }
    }

    // Log the form submission for debugging
    console.log("Processing quote form submission:", validatedFields.data)

    // Prepare notification content
    const emailHtml = `
    <h1>New Quote Request</h1>
    <p><strong>Name:</strong> ${validatedFields.data.firstName} ${validatedFields.data.lastName}</p>
    <p><strong>Email:</strong> ${validatedFields.data.email}</p>
    <p><strong>Phone:</strong> ${validatedFields.data.phone}</p>
    <p><strong>Service:</strong> ${validatedFields.data.service}</p>
    <p><strong>Details:</strong> ${validatedFields.data.details}</p>
  `

    const discordMessage = `💰 **New Quote Request**
Name: ${validatedFields.data.firstName} ${validatedFields.data.lastName}
Email: ${validatedFields.data.email}
Phone: ${validatedFields.data.phone}
Service: ${validatedFields.data.service}
Details: ${validatedFields.data.details}`

    // Send notifications
    let emailSent = false
    let discordSent = false

    // Send email notification
    emailSent = await sendEmailNotification(resend, "info@ngmlandscape.ca", "New Quote Request", emailHtml)

    // Send Discord notification
    discordSent = await sendDiscordNotification(discordMessage)

    // Log notification status
    console.log("Notification status - Email:", emailSent, "Discord:", discordSent)

    return {
      status: "success",
      message: "Thank you for your quote request! We will contact you shortly to discuss your project.",
    }
  } catch (error) {
    console.error("Error submitting quote form:", error)
    return {
      status: "error",
      message: "Something went wrong. Please try again later.",
    }
  }
}

