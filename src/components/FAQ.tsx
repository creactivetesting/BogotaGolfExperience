"use client";

import * as Accordion from "@radix-ui/react-accordion";

function toFaqId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const faqs = [
  {
    question: "Why do golf balls travel further in Bogotá?",
    answer:
      "Bogotá sits at a high altitude, which reduces air resistance and helps golf balls fly farther than they would at sea level. That makes the course feel extra exciting, especially on long drives and approach shots.",
  },
  {
    question: "What is the weather like for golf in Bogotá?",
    answer:
      "The weather is usually mild and spring-like, with cooler mornings and afternoons that are comfortable for golf. Rain can appear during the day, so layered clothing and a flexible schedule are a smart choice.",
  },
  {
    question: "How much does a golf trip to Bogotá cost?",
    answer:
      "Pricing depends on the number of players, the golf courses selected, hotel preferences, and transfer needs. Our private experiences are designed to be all-inclusive and tailored so you can budget with clarity from the start.",
  },
  {
    question: "Are there direct flights from the US to Bogotá?",
    answer:
      "Yes, there are regular nonstop flights from several major US cities to Bogotá. We can also help you plan the best route and timing for your golf trip based on your departure city.",
  },
  {
    question: "Do I need to speak Spanish to play golf in Bogotá?",
    answer:
      "No. Our team is bilingual and can support you throughout the experience, from booking to the course. You can enjoy the trip comfortably without needing to speak Spanish.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="px-6 py-20 md:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to know before your Bogotá golf escape
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Get quick answers to the most common questions about playing golf in Bogotá and planning your private experience.
          </p>
        </div>

        <Accordion.Root type="single" collapsible className="mt-12 space-y-4">
          {faqs.map((faq, index) => (
            (() => {
              const faqId = toFaqId(faq.question);
              const triggerId = `faq-trigger-${faqId}`;
              const contentId = `faq-content-${faqId}`;

              return (
            <Accordion.Item
              key={faq.question}
              value={faq.question}
              className="overflow-hidden rounded-2xl border border-primary/10 bg-white/80 shadow-sm backdrop-blur"
            >
              <Accordion.Header>
                <Accordion.Trigger
                  id={triggerId}
                  aria-controls={contentId}
                  className="group flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-semibold text-slate-900 transition hover:bg-primary/5"
                >
                  <span>{`${index + 1}. ${faq.question}`}</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-200 group-data-[state=open]:rotate-180">
                    +
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content
                id={contentId}
                aria-labelledby={triggerId}
                className="overflow-hidden data-[state=closed]:animate-[fade-out_200ms] data-[state=open]:animate-[fade-in_200ms]"
              >
                <div className="px-6 pb-6 pt-1 text-sm leading-7 text-slate-700">
                  {faq.answer}
                </div>
              </Accordion.Content>
            </Accordion.Item>
              );
            })()
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
