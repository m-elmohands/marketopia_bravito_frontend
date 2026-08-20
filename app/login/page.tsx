"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useStore } from "@/context/store-context";
import { useLocale } from "@/context/locale-context";
import Logo from "@/components/logo";
export default function Login() {
  const { login } = useStore();
  const { dictionary: d } = useLocale();
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(e.currentTarget);
    try {
      await login(String(data.get("identifier")), String(data.get("password")));
      const next = new URLSearchParams(window.location.search).get("next");
      router.push(next || "/account");
    } catch (e) {
      setError(e instanceof Error ? e.message : d.auth.loginError);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth-page">
      <div className="auth-panel">
        <Logo />
        <div>
          <span className="eyebrow">{d.auth.welcome}</span>
          <h1>{d.auth.goodToSee}</h1>
          <p>{d.auth.loginCopy}</p>
        </div>
        <form onSubmit={submit} className="form">
          <label>
            {d.auth.identifier}
            <input
              name="identifier"
              required
              autoComplete="username"
              placeholder={d.auth.emailPlaceholder}
            />
          </label>
          <label>
            {d.auth.password}
            <input
              name="password"
              required
              minLength={8}
              type="password"
              autoComplete="current-password"
              placeholder={d.auth.passwordHint}
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button disabled={busy} className="button full">
            {busy ? d.auth.signingIn : d.common.signIn}
          </button>
        </form>
        <p className="auth-switch">
          {d.auth.newHere} <Link href="/register">{d.auth.createAccount}</Link>
        </p>
      </div>
      <div className="auth-visual">
        <blockquote>
          “{d.auth.loginQuote}”<cite>{d.auth.loginQuoteAuthor}</cite>
        </blockquote>
      </div>
    </div>
  );
}
