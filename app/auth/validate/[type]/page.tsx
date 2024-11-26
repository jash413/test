// app/auth/validate/[type]/page.tsx
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import ValidateForm from "./ValidateForm"
import React from "react"

export default async function ValidatePage({ params }: { params: { type: 'email' | 'phone' } }) {
  const session = await auth()
  
  if (!session) {
    redirect("/auth/signin")
  }

  const { type } = params

  if (type !== 'email' && type !== 'phone') {
    redirect("/dashboard")
  }

  if (session.user[`${type}Verified`]) {
    redirect("/dashboard")
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Validate Your {type.charAt(0).toUpperCase() + type.slice(1)}</h1>
      <ValidateForm type={type} />
    </div>
  )
}