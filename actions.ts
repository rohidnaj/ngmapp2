"use server"

import fs from "fs"
import path from "path"

export async function loadContentFromServer() {
  try {
    const filePath = path.join(process.cwd(), "data", "content.json")
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf-8")
      const content = JSON.parse(fileData)
      return { success: true, content }
    }
  } catch (error) {
    console.error("Failed to load content from server:", error)
  }
  return { success: false }
}

export async function saveContentToServer(content: any) {
  try {
    const dataDir = path.join(process.cwd(), "data")
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    const filePath = path.join(dataDir, "content.json")
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2), "utf-8")
    return { success: true }
  } catch (error) {
    console.error("Failed to save content to server:", error)
    return { success: false, error: String(error) }
  }
}

export async function submitContactForm(prevState: any, formData: FormData) {
  try {
    const name = formData.get("name")
    const email = formData.get("email")
    const message = formData.get("message")
    if (!name || !email || !message) {
      return { status: "error", message: "Please fill in all required fields." }
    }
    return { status: "success", message: "Thank you! Your message has been sent successfully." }
  } catch (error) {
    return { status: "error", message: "An unexpected error occurred. Please try again." }
  }
}

export async function submitQuoteForm(prevState: any, formData: FormData) {
  try {
    const firstName = formData.get("firstName")
    const email = formData.get("email")
    if (!firstName || !email) {
      return { status: "error", message: "Please fill in all required fields." }
    }
    return { status: "success", message: "Thank you! Your quote request has been received." }
  } catch (error) {
    return { status: "error", message: "An unexpected error occurred. Please try again." }
  }
}
