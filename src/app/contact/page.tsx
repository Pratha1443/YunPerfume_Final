"use client";

import { useState } from "react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="bg-transparent pt-32 pb-32 md:pt-40">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid gap-16 md:grid-cols-12 md:gap-20">
          <div className="md:col-span-5">
            <div className="flex items-center gap-4">
              <span className="block h-px w-12 bg-foreground/40" />
              <span className="eyebrow text-foreground/60">Write to us</span>
            </div>
            <h1 className="h-display mt-6 text-[14vw] leading-[0.9] md:text-[7vw] lg:text-[110px]">
              Hello,<br />
              <em className="italic font-light text-accent">we listen.</em>
            </h1>
            <p className="mt-8 max-w-sm leading-relaxed text-muted-foreground">
              Every message is read by a person at the atelier, usually within two working days.
              No bots, no templates.
            </p>

            <dl className="mt-12 space-y-6 text-sm">
              <div>
                <dt className="eyebrow text-muted-foreground">Atelier</dt>
                <dd className="mt-1 font-display text-xl font-light">
                  Indiranagar, Bengaluru 560038
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-muted-foreground">Studio hours</dt>
                <dd className="mt-1">Mon — Sat, 11:00 to 19:00 IST</dd>
              </div>
              <div>
                <dt className="eyebrow text-muted-foreground">Email</dt>
                <dd className="mt-1">
                  <a href="mailto:atelier@yun.in" className="hover:text-accent">atelier@yun.in</a>
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-muted-foreground">Phone</dt>
                <dd className="mt-1">
                  <a href="tel:+918000000000" className="hover:text-accent">+91 80 0000 0000</a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="md:col-span-7">
            {submitted ? (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-sm border border-border/60 bg-card p-12 text-center">
                <div className="font-display text-4xl font-light">Thank you.</div>
                <p className="mt-4 max-w-sm text-muted-foreground">
                  Your note has reached the atelier. We will reply from a human inbox within
                  two working days.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-8"
              >
                <Field label="Name" name="name" type="text" required />
                <Field label="Email" name="email" type="email" required />
                <Field label="Subject" name="subject" type="text" />
                <div>
                  <label htmlFor="message" className="eyebrow mb-3 block text-muted-foreground">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className="w-full resize-none border-b border-foreground/30 bg-transparent py-3 font-display text-xl font-light outline-none transition-colors focus:border-foreground"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-foreground px-12 py-5 text-sm tracking-wider text-background transition-colors hover:bg-accent"
                >
                  SEND MESSAGE
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, type, required }: { label: string; name: string; type: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="eyebrow mb-3 block text-muted-foreground">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full border-b border-foreground/30 bg-transparent py-3 font-display text-xl font-light outline-none transition-colors focus:border-foreground"
      />
    </div>
  );
}
