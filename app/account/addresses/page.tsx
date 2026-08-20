"use client";
import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useStore } from "@/context/store-context";
import type { Address, City } from "@/lib/types";
import { useLocale } from "@/context/locale-context";
export default function Addresses() {
  const { token, user } = useStore();
  const { locale, dictionary: dictionary } = useLocale();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [status, setStatus] = useState("");
  async function load() {
    if (!token) return;
    const [a, c] = await Promise.all([
      api<Address[]>("/addresses", {}, token),
      api<{ cities: City[] }>("/config"),
    ]);
    setAddresses(a);
    setCities(c.cities || []);
  }
  useEffect(() => {
    load().catch(() => {});
  }, [token, locale]);
  async function add(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setStatus(dictionary.account.saving);
    try {
      await api(
        "/addresses",
        {
          method: "POST",
          body: JSON.stringify({
            name: formData.get("name"),
            address: formData.get("address"),
            phone: formData.get("phone"),
            city_id: Number(formData.get("city_id")),
            lat: 30.0444,
            lng: 31.2357,
            is_default: addresses.length === 0,
          }),
        },
        token,
      );
      form.reset();
      await load();
      setStatus(dictionary.account.addressSaved);
    } catch (e) {
      setStatus(
        e instanceof Error ? e.message : dictionary.account.addressError,
      );
    }
  }
  async function remove(id: number) {
    await api(`/addresses/${id}`, { method: "DELETE" }, token);
    load();
  }
  return (
    <div className="page-shell address-page">
      <header>
        <span className="eyebrow">{dictionary.account.yourAccount}</span>
        <h1>{dictionary.account.deliveryAddresses}</h1>
      </header>
      <div className="address-layout">
        <div>
          {addresses.map((a) => (
            <article className="address-card" key={a.id}>
              <span>
                {a.name}
                {a.is_default && <small>{dictionary.account.default}</small>}
              </span>
              <p>{a.address}</p>
              <p>{a.phone}</p>
              <button onClick={() => remove(a.id)}>
                {dictionary.common.remove}
              </button>
            </article>
          ))}
        </div>
        <form className="form address-form" onSubmit={add}>
          <h2>{dictionary.account.addAddress}</h2>
          <label>
            {dictionary.account.label}
            <select name="name">
              <option value="home">{dictionary.account.home}</option>
              <option value="work">{dictionary.account.work}</option>
              <option value="other">{dictionary.account.other}</option>
            </select>
          </label>
          <label>
            {dictionary.account.fullAddress}
            <textarea name="address" required rows={3} />
          </label>
          <label>
            {dictionary.account.phone}
            <input
              name="phone"
              required
              pattern="01[0-9]{9}"
              defaultValue={user?.phone}
            />
          </label>
          <label>
            {dictionary.account.city}
            <select name="city_id" required>
              <option value="">{dictionary.account.chooseCity}</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name || c.name_en}
                </option>
              ))}
            </select>
          </label>
          <button className="button">{dictionary.account.saveAddress}</button>
          {status && <p className="form-status">{status}</p>}
        </form>
      </div>
    </div>
  );
}
