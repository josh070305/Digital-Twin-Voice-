export function Header() {
  return (
    <header className="text-center select-none">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
        <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
          Joshna AI
        </span>
      </h1>
      <p className="text-sm md:text-base text-[var(--color-text-muted)] mt-1 font-medium tracking-wide">
        Digital Twin • Voice Assistant
      </p>
    </header>
  );
}
