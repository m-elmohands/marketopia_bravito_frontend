"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useStore } from "@/context/store-context";
import { useLocale } from "@/context/locale-context";
import Logo from "@/components/logo";

export default function Register() {
  const { register } = useStore();
  const { dictionary: dictionary } = useLocale();
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const formData = Object.fromEntries(
      new FormData(e.currentTarget),
    ) as Record<string, string>;
    try {
      await register(formData);
      router.push("/account");
    } catch (e) {
      setError(e instanceof Error ? e.message : dictionary.auth.registerError);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth-page">
      <div className="auth-panel">
        <Logo />
        <div>
          <span className="eyebrow">{dictionary.auth.join}</span>
          <h1>{dictionary.auth.registerTitle}</h1>
          <p>{dictionary.auth.registerCopy}</p>
        </div>
        <form onSubmit={submit} className="form compact">
          <label>
            {dictionary.auth.fullName}
            <input
              name="name"
              required
              placeholder={dictionary.auth.yourName}
            />
          </label>
          <div className="form-row">
            <label>
              {dictionary.account.email}
              <input
                name="email"
                type="email"
                required
                placeholder={dictionary.auth.emailPlaceholder}
              />
            </label>
            <label>
              {dictionary.auth.phone}
              <input
                name="phone"
                pattern="01[0-9]{9}"
                required
                placeholder="01xxxxxxxxx"
              />
            </label>
          </div>
          <label>
            {dictionary.auth.password}
            <input
              name="password"
              type="password"
              minLength={8}
              required
              placeholder={dictionary.auth.passwordCreate}
            />
          </label>
          <label>
            {dictionary.auth.confirmPassword}
            <input
              name="password_confirmation"
              type="password"
              minLength={8}
              required
              placeholder={dictionary.auth.repeatPassword}
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button disabled={busy} className="button full">
            {busy ? dictionary.auth.creating : dictionary.auth.createAccount}
          </button>
        </form>
        <p className="auth-switch">
          {dictionary.auth.already}{" "}
          <Link href="/login">{dictionary.common.signIn}</Link>
        </p>
      </div>
      <div className="auth-visual register-visual">
        <blockquote>
          {dictionary.auth.registerQuoteLineOne}
          <br />
          {dictionary.auth.registerQuoteLineTwo}
          <br />
          <em>{dictionary.auth.registerQuoteLineThree}</em>
        </blockquote>
      </div>
    </div>
  );
}
