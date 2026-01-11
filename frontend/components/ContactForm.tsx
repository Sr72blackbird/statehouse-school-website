"use client";

import { useState } from "react";

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Disabled for now - coming soon
    setStatus("idle");
    setMessage("Contact form is coming soon! Please use the contact information in the footer for now.");
    return;
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md opacity-75">
      <h3
        className="text-xl font-bold mb-4"
        style={{ color: "var(--school-navy)" }}
      >
        Contact Us <span className="text-sm font-normal text-slate-500">(Coming Soon)</span>
      </h3>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled
            className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[var(--school-navy)] focus:ring-offset-2"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled
            className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[var(--school-navy)] focus:ring-offset-2"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--school-navy)] focus:ring-offset-2"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">
            Subject <span className="text-red-500">*</span>
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            disabled
            className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[var(--school-navy)] focus:ring-offset-2"
          >
            <option value="">Select a subject</option>
            <option value="admissions">Admissions Inquiry</option>
            <option value="general">General Inquiry</option>
            <option value="academics">Academic Questions</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--school-navy)] focus:ring-offset-2 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled
          className="w-full px-6 py-3 rounded-lg font-semibold transition-all opacity-50 cursor-not-allowed"
          style={{
            backgroundColor: "var(--school-navy)",
            color: "white",
          }}
        >
          Coming Soon
        </button>

        {message && (
          <p
            className={`text-sm ${
              status === "success" ? "text-green-600" : "text-red-600"
            }`}
            role="alert"
          >
            {message}
          </p>
        )}
      </div>
    </form>
  );
}
