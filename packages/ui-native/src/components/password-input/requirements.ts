/** One password rule shown as a Badge in the Requirements frame. */
export interface PasswordRequirement {
  label: string;
  test: (value: string) => boolean;
}

/** Figma: PasswordInput → Requirements. Provisional: the special-character examples are "(…)" in Figma. */
export const DEFAULT_PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { label: "A number", test: (v) => /\d/.test(v) },
  { label: "A special character (!@#$%)", test: (v) => /[^A-Za-z0-9\s]/.test(v) },
  { label: "At least 8 characters", test: (v) => v.length >= 8 },
  { label: "A capital letter", test: (v) => /[A-Z]/.test(v) },
];
