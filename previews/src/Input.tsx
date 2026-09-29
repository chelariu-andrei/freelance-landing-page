import * as React from "react";
import { Input, icons } from "ac";
import { mount } from "./_data";
const { Mail, Search } = icons;
mount(
  <div className="ac-root grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="flex flex-col gap-6 bg-cream p-6 rounded-lg">
      <Input label="Email" placeholder="you@company.ro" iconLeft={<Mail size={18} strokeWidth={1.75} />} hint="We reply within one working day." />
      <Input label="Phone" defaultValue="07" error="Enter a full phone number." />
      <Input label="Disabled" placeholder="Not editable" disabled />
    </div>
    <div className="ac-dark flex flex-col gap-6 bg-ink p-6 rounded-lg">
      <Input tone="dark" size="lg" label="Search properties" hideLabel placeholder="Search by area or street" iconLeft={<Search size={20} strokeWidth={1.75} />} />
      <Input tone="dark" label="Name" placeholder="Full name" hint="As on your ID." />
    </div>
  </div>
);
