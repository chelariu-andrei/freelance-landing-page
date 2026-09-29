import * as React from "react";
import { SignalCard } from "ac";
import { mount, people } from "./_data";
mount(
  <div className="ac-root grid grid-cols-1 md:grid-cols-3 gap-4 bg-cream p-4 rounded-lg">
    <SignalCard title="Buyer Signal" delta="+92%" people={people} extraCount={12} />
    <div className="bg-yellow p-4 rounded-lg"><SignalCard surface="white" title="Buyer Signal" delta="+18%" people={people.slice(0, 4)} /></div>
    <SignalCard title="Loading" people={[]} loading />
  </div>
);
