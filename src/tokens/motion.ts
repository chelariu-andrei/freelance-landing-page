/** Motion tokens (seconds / cubic-bezier arrays) — mirror of the --dur-* and --ease-* CSS variables. */
export const duration = { fast: 0.15, base: 0.3, slow: 0.6, hero: 0.9 } as const;
export const ease = {
  out: [0.22, 1, 0.36, 1] as [number, number, number, number],
  inOut: [0.65, 0, 0.35, 1] as [number, number, number, number],
};
export const distance = { sm: 12, md: 24, lg: 48 } as const;
export const stagger = { tight: 0.06, base: 0.1, loose: 0.16 } as const;
export const motionTokens = { duration, ease, distance, stagger };
export type MotionParams = { duration?: number; delay?: number; ease?: [number, number, number, number] };
