/**
 * What a cell's `onChangeText` does to the code (pure, so it can be tested without React Native).
 * - several characters (paste / one-time-code autofill, which the cell's `maxLength` lets through) fill the cells from `i`;
 * - typing over a filled cell yields old + new: only the new character is kept;
 * - a single character (or an erase) edits cell `i`.
 * `focusIndex` is the cell to focus next, or `null` to stay.
 */
export const applyCellInput = (
  value: string,
  i: number,
  text: string,
  amount: number,
): { next: string; focusIndex: number | null } => {
  let digits = text.replace(/\s/g, "");
  const old = value[i];
  if (old && digits.length === 2 && digits.includes(old)) digits = digits.replace(old, "");
  if (digits.length > 1) {
    return {
      next: (value.slice(0, i) + digits).slice(0, amount),
      focusIndex: i + digits.length,
    };
  }
  const chars = value.padEnd(amount, " ").split("");
  chars[i] = digits === "" ? " " : digits;
  return { next: chars.join("").replace(/\s+$/, ""), focusIndex: digits ? i + 1 : null };
};
