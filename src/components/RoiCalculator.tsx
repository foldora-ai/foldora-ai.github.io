import { useState } from "react";
import { motion } from "framer-motion";

import { product } from "@/config/product";

const PRICE = product.price.amount;

export default function RoiCalculator() {
  const [hours, setHours] = useState(3);
  const [rate, setRate] = useState(30);
  const [weeks, setWeeks] = useState(48);

  const timeSaved = hours * weeks;
  const moneySaved = timeSaved * rate;
  const roi = ((moneySaved - PRICE) / PRICE) * 100;

  return (
    <section className="section-padding">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-3xl font-bold md:text-5xl">
            See how much time <span className="text-gradient">Foldora saves you</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Estimate the value of time you spend manually organizing and renaming files.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-10 md:grid-cols-2">
          <div className="space-y-8">
            <div>
              <label htmlFor="hours" className="text-sm font-medium">
                Hours spent organizing files per week
              </label>
              <input
                id="hours"
                type="range"
                min="0"
                max="10"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="mt-3 w-full"
              />
              <p className="mt-1 text-sm text-muted-foreground">{hours} hours</p>
            </div>

            <div>
              <label htmlFor="rate" className="text-sm font-medium">
                Your hourly value ($)
              </label>
              <input
                id="rate"
                type="range"
                min="10"
                max="150"
                step="5"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="mt-3 w-full"
              />
              <p className="mt-1 text-sm text-muted-foreground">${rate}/hour</p>
            </div>

            <div>
              <label htmlFor="weeks" className="text-sm font-medium">
                Working weeks per year
              </label>
              <input
                id="weeks"
                type="range"
                min="10"
                max="52"
                value={weeks}
                onChange={(e) => setWeeks(Number(e.target.value))}
                className="mt-3 w-full"
              />
              <p className="mt-1 text-sm text-muted-foreground">{weeks} weeks</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border bg-card p-8"
          >
            <h3 className="mb-6 text-xl font-semibold">Your Potential Savings</h3>

            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground">Time saved annually</p>
                <p className="text-3xl font-bold text-primary">{timeSaved} hours</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Value of your time saved</p>
                <p className="text-3xl font-bold text-primary">${moneySaved.toLocaleString()}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Estimated ROI of Foldora</p>
                <p className="text-3xl font-bold text-green-500">{Math.round(roi).toLocaleString()}%</p>
              </div>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Based on a one-time purchase of {product.price.display}. This is an estimate from your inputs, not a benchmark or guarantee.
            </p>

            <p className="mt-3 text-base font-semibold text-foreground">
              At these inputs, Foldora pays for itself in less than 1 hour.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
