export default function BottomNavigation() {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(env(safe-area-inset-bottom),1rem)]"
    >
      <div className="glass-nav flex w-full max-w-sm items-center justify-around rounded-full px-2 py-2 shadow-[var(--shadow-float)]"></div>
    </nav>
  );
}
