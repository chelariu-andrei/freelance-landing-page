export const CONTACT_FALLBACK = "/#contact";

export const isPlaceholder = (v: string) => /^\{\{[A-Z0-9_]+\}\}$/.test(v.trim());

export const isSet = (v: string | undefined): v is string => !!v && !isPlaceholder(v);

export const resolveHref = (v: string, fallback: string = CONTACT_FALLBACK) => (isSet(v) ? v : fallback);

export const mailtoHref = (email: string) => (isSet(email) ? `mailto:${email}` : CONTACT_FALLBACK);
