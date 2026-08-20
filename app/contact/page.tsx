"use client";
import { FormEvent, useState } from "react";
import { api } from "@/lib/api";
import { useLocale } from "@/context/locale-context";
export default function Contact() {
  const { dictionary: d } = useLocale();
  const [status, setStatus] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus(d.contact.sending);
    const formData = Object.fromEntries(new FormData(form));
    try {
      await api("/contact-messages", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      setStatus(d.contact.sent);
      form.reset();
    } catch (e) {
      setStatus(
        e instanceof Error ? e.message : "Could not send your message.",
      );
    }
  }
  return (
    <div className="page-shell contact-page">
      <div>
        <span className="eyebrow">{d.contact.eyebrow}</span>
        <h1>{d.contact.title}</h1>
        <p>{d.contact.copy}</p>
        <dl>
          <dt>{d.contact.email}</dt>
          <dd>hello@bravito.com</dd>
          <dt>{d.contact.hours}</dt>
          <dd>
            Sunday–Thursday
            <br />
            9:00–17:00 Cairo time
          </dd>
        </dl>
      </div>
      <form className="form contact-form" onSubmit={submit}>
        <div className="form-row">
          <label>
            {d.contact.name}
            <input required name="name" />
          </label>
          <label>
            Email
            <input required type="email" name="email" />
          </label>
        </div>
        <label>
          {d.contact.phone} <small>({d.contact.optional})</small>
          <input name="phone" />
        </label>
        <label>
          {d.contact.subject}
          <input required name="subject" />
        </label>
        <label>
          {d.contact.message}
          <textarea required name="message" rows={6} />
        </label>
        <button className="button">{d.contact.send}</button>
        {status && <p className="form-status">{status}</p>}
      </form>
    </div>
  );
}
