"use client";

import { useState, FormEvent } from "react";

import "./page.styles.css";

export default function Home() {
  const [website, setWebsite] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (website) {
      setIsSubmitted(true);

      const res = await fetch(
        "http://localhost:3000/api/web-scrape"
      );
    }
  }

  return (
    <main>
      <form className="explore-form" onSubmit={onSubmit}>
        <label>Site to Explore</label>
        <input
          type="url"
          onChange={(e) => setWebsite(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>

      {website && isSubmitted && (
        <iframe src={website}></iframe>
      )}
    </main>
  );
}
