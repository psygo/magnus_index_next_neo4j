"use client";

import { useState, FormEvent } from "react";
import "./page.styles.css";

export default function Home() {
  const [website, setWebsite] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (website) {
      const res = await fetch(website);

      const content = await res.text();
      console.log(content);

      document.getElementById("content")!.innerHTML = content;
      const scripts = document.querySelectorAll("script");

      for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];

        if (script.innerText) {
          eval(script.innerText);
        } else {
          const src = script.src.startsWith("http")
            ? script.src
            : website + script.src;

          fetch(script.src).then(function (data) {
            data.text().then(function (r) {
              eval(r);
            });
          });
        }

        // To not repeat the element
        scripts[i].parentNode!.removeChild(scripts[i]);
      }
    }
  }

  return (
    <main>
      <h1>Hello World</h1>

      <form id="explore-form" onSubmit={onSubmit}>
        <label>Site to Explore</label>
        <input type="url" onChange={(e) => setWebsite(e.target.value)} />
        <button type="submit">Submit</button>
      </form>

      <div id="content"></div>
    </main>
  );
}
