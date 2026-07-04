export default function CTA() {
  return (
    <section className="mt-8 px-5">
      <div className="rounded-3xl bg-primary p-6 text-primary-foreground">
        <p className="text-[10px] uppercase tracking-[0.18em] text-primary-foreground/70">
          Members
        </p>
        <h3 className="mt-2 font-display text-2xl leading-tight">
          Early access to every new drop
        </h3>
        <p className="mt-2 text-sm text-primary-foreground/80">
          Join the Lila Circle for first looks, private styling, and
          invitations.
        </p>
        <button className="mt-4 h-11 rounded-full bg-surface-elevated px-5 text-sm font-medium text-foreground">
          Join Lila Circle
        </button>
      </div>
    </section>
  );
}
