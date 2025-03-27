"use client"

import type React from "react"

import { useActionState } from "react"
import { submitQuoteForm } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface QuoteFormProps {
  services: {
    title: string
    description: string
    image: string
    features: string[]
  }[]
}

const initialState = {
  status: "",
  message: "",
  errors: {},
}

export default function QuoteForm({ services }: QuoteFormProps) {
  const [state, formAction, isPending] = useActionState(submitQuoteForm, initialState)
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: "",
    details: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelectChange = (value: string) => {
    setFormValues({
      ...formValues,
      service: value,
    })
  }

  // Reset form if submission was successful
  if (state?.status === "success" && formValues.firstName) {
    setFormValues({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      service: "",
      details: "",
    })
  }

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 mb-2">First Name</label>
          <Input
            type="text"
            name="firstName"
            value={formValues.firstName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          {state?.errors?.firstName && <FormError message={state.errors.firstName[0]} />}
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Last Name</label>
          <Input
            type="text"
            name="lastName"
            value={formValues.lastName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          {state?.errors?.lastName && <FormError message={state.errors.lastName[0]} />}
        </div>
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
        <label className="block text-gray-700 mb-2">Phone</label>
        <Input
          type="tel"
          name="phone"
          value={formValues.phone}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
          required
        />
        {state?.errors?.phone && <FormError message={state.errors.phone[0]} />}
      </div>
      <div>
        <label className="block text-gray-700 mb-2">Service Required</label>
        <Select value={formValues.service} onValueChange={handleSelectChange} name="service">
          <SelectTrigger className="w-full p-3 border border-gray-300 rounded-lg">
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            {services.map((service, index) => (
              <SelectItem key={index} value={service.title}>
                {service.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state?.errors?.service && <FormError message={state.errors.service[0]} />}
      </div>
      <div>
        <label className="block text-gray-700 mb-2">Project Details</label>
        <Textarea
          name="details"
          value={formValues.details}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg h-32"
          required
        />
        {state?.errors?.details && <FormError message={state.errors.details[0]} />}
      </div>

      {state?.status === "error" && !state.errors && <FormError message={state.message} />}

      {state?.status === "success" && <FormSuccess message={state.message} />}

      <Button
        type="submit"
        className="bg-green-700 text-white px-8 py-3 rounded-md cursor-pointer whitespace-nowrap"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Quote Request"
        )}
      </Button>
    </form>
  )
}

