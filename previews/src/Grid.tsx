import * as React from "react";
import { Container, Grid } from "ac";
import { mount } from "./_data";
const Cell = ({ n }: { n: number }) => <div className="bg-periwinkle rounded-md h-16 flex items-center justify-center font-display text-button-lg">{n}</div>;
mount(
  <div className="ac-root bg-cream py-6 rounded-lg flex flex-col gap-6">
    <Container><Grid cols={4}>{[1, 2, 3, 4].map((n) => <Cell key={n} n={n} />)}</Grid></Container>
    <Container><Grid cols={3} gap="sm">{[1, 2, 3].map((n) => <Cell key={n} n={n} />)}</Grid></Container>
    <Container><Grid cols={2} gap="lg">{[1, 2].map((n) => <Cell key={n} n={n} />)}</Grid></Container>
  </div>
);
