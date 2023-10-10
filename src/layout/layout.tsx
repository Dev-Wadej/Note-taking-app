import React, { ReactNode } from "react";
import Header from "./Header";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main>
      <section>
        <Header />
      </section>
      <section className="mx-6 mt-10">{children}</section>
    </main>
  );
}
