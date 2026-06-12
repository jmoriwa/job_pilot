export function hasInsforgeConfig(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_INSFORGE_URL && process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
  );
}
