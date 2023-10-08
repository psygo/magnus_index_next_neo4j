"use client";

import { useState, FormEvent } from "react";

import "./page.styles.css";

export default function Home() {
  const [website, setWebsite] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (website) {
      const res = await fetch(website);
    }
  }

  return (
    <main>
      <form id="explore-form" onSubmit={onSubmit}>
        <label>Site to Explore</label>
        <input type="url" onChange={(e) => setWebsite(e.target.value)} />
        <button type="submit">Submit</button>
      </form>

      {website && <iframe src={website}></iframe>}
    </main>
  );
}
