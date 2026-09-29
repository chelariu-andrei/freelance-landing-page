import * as React from "react";
import { AvatarStack } from "ac";
import { mount, people } from "./_data";
mount(
  <div className="ac-root flex flex-col gap-4">
    <div className="bg-yellow p-6 rounded-lg"><AvatarStack people={people} extraCount={12} ground="yellow" /></div>
    <div className="bg-cream p-6 rounded-lg"><AvatarStack people={people} size="sm" max={3} ground="cream" /></div>
  </div>
);
