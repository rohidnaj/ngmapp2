"use client"

import type React from "react"

import { useActionState } from "react"
import { submitContactForm } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"
import { useState } from "react"
import { Loader2 } from "lucide-react"

const initialState = {
  status: "",
  message: "",
  errors: {},
}

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState)
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    })
  }

  // Reset form if submission was successful
  if (state?.status === "success" && formValues.name) {
    setFormValues({
      name: "",
      email: "",
      message: "",
    })
  }

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label className="block text-gray-700 mb-2">Name</label>
        <Input
          type="text"
          name="name"
          value={formValues.name}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
          required
        />
        {state?.errors?.name && <FormError message={state.errors.name[0]} />}
      </div>
      <div>
        <label className="block text-gray-700 mb-2">Email</label>
        <Input
          type="email"
          name="email"
          value={formValues.email}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
          required
        />
        {state?.errors?.email && <FormError message={state.errors.email[0]} />}
      </div>
      <div>
        <label className="block text-gray-700 mb-2">Message</label>
        <Textarea
          name="message"
          value={formValues.message}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg h-32"
          required
        />
        {state?.errors?.message && <FormError message={state.errors.message[0]} />}
      </div>

      {state?.status === "error" && !state.errors && <FormError message={state.message} />}

      {state?.status === "success" && <FormSuccess message={state.message} />}

      <Button
        type="submit"
        className="bg-primary text-white px-6 py-3 rounded-md cursor-pointer whitespace-nowrap"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  )
}
