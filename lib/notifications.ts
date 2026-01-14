// Function to send notifications via Discord webhook
export async function sendDiscordNotification(message: string): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL

  if (!webhookUrl) {
    console.log("Discord webhook URL not configured. Notification would be sent:", message)
    return false
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: message,
      }),
    })

    if (!response.ok) {
      throw new Error(`Discord webhook error: ${response.status} ${response.statusText}`)
    }

    return true
  } catch (error) {
    console.error("Error sending Discord notification:", error)
    return false
  }
}

// Function to send email notification with better error handling
export async function sendEmailNotification(
  emailClient: any,
  to: string,
  subject: string,
  htmlContent: string,
): Promise<boolean> {
  try {
    const result = await emailClient.emails.send({
      from: "Najm Garden <notifications@ngmlandscape.ca>",
      to: to,
      subject: subject,
      html: htmlContent,
    })

    console.log("Email sent successfully:", result)
    return true
  } catch (error) {
    console.error("Error sending email notification:", error)
    return false
  }
}
