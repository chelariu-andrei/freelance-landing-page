import * as React from "react";
import { Card } from "ac";
import { mount } from "./_data";
const T = ({ t, s }: { t: string; s: string }) => (<><p className="m-0 font-display text-button-lg">{t}</p><p className="m-0 mt-2 text-sm opacity-80">{s}</p></>);
mount(
  <div className="ac-root bg-cream p-6 rounded-lg grid grid-cols-2 md:grid-cols-3 gap-4">
    <Card surface="white"><T t="White" s="Default card on cream." /></Card>
    <Card surface="stone"><T t="Stone" s="Media backing, muted blocks." /></Card>
    <Card surface="yellow"><T t="Yellow" s="One accent card per view." /></Card>
    <Card surface="ink"><T t="Ink" s="Dark emphasis card." /></Card>
    <Card surface="white" interactive href="#card"><T t="Interactive" s="Hover: lift + soft shadow." /></Card>
    <Card surface="white" radius="md" padding="sm"><T t="Radius md" s="Rows and small tiles." /></Card>
  </div>
);
