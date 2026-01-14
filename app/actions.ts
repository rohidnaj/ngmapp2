"use server"
import { contactFormSchema, quoteFormSchema } from "@/lib/validations"
import { Resend } from "resend"
import { sendDiscordNotification, sendEmailNotification } from "@/lib/notifications"
import dbConnect from "@/lib/mongodb"
import ContentModel from "@/lib/models/content"
import { ContentState } from "@/lib/content-context"

// Initialize Resend with better error handling
let resend: Resend
try {
  resend = new Resend(process.env.RESEND_API_KEY)
  console.log("Resend initialized successfully")
} catch (error) {
  console.error("Failed to initialize Resend:", error)
  resend = {} as Resend // Fallback empty object to prevent runtime errors
}

// Save content to MongoDB
export async function saveContentToServer(content: ContentState) {
  try {
    // Connect to the database
    await dbConnect()
    
    // Find any existing content document
    const existingContent = await ContentModel.findOne()
    
    if (existingContent) {
      // Update existing document
      await ContentModel.findByIdAndUpdate(existingContent._id, content)
      console.log("Content updated in MongoDB")
    } else {
      // Create new document
      await ContentModel.create(content)
      console.log("Content created in MongoDB")
    }
    
    return { success: true, message: "Content saved successfully" }
  } catch (error) {
    console.error("Error saving content to MongoDB:", error)
    return { success: false, message: "Error saving content" }
  }
}

// Load content from MongoDB
export async function loadContentFromServer() {
  try {
    // Connect to the database
    await dbConnect()
    
    // Find content document
    const contentDoc = await ContentModel.findOne()
    
    if (!contentDoc) {
      console.log("No content found in MongoDB")
      return { success: false, message: "No content found" }
    }
    
    // Convert to plain object and remove MongoDB specific fields
    const content = contentDoc.toObject()
    delete content._id
    delete content.__v
    delete content.createdAt
    delete content.updatedAt
    
    console.log("Content loaded from MongoDB")
    return { success: true, content }
  } catch (error) {
    console.error("Error loading content from MongoDB:", error)
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
