const STEPS = [
  { label: 'Pick your design', hint: 'Choose from many templates' },
  { label: 'Send your brand details', hint: 'Logo, colours, phone' },
  { label: 'We launch in under 36 hours', hint: 'Live on your own domain' },
];

export default function StepsTileMarker() {
  return (
    <section className="abtm" aria-labelledby="abtm-heading">
      <p className="abtm-eyebrow">How it works</p>
      <h2 className="abtm-heading" id="abtm-heading">
        Simple 3-step launch
      </h2>

      <div className="abtm-grid">
        {STEPS.map((step, i) => (
          <div className="abtm-tile" key={step.label} style={{ animationDelay: `${i * 1.1}s` }}>
            <span className="abtm-num" style={{ animationDelay: `${i * 1.1}s` }}>
              {i + 1}
            </span>

            <span className="abtm-visual" aria-hidden="true">
              {i === 0 && (
                <span className="abtm-cards">
                  <b />
                  <b />
                  <b />
                </span>
              )}
              {i === 1 && (
                <span className="abtm-chips">
                  <b />
                  <b />
                  <b />
                </span>
              )}
              {i === 2 && (
                <span className="abtm-live">
                  <b />
                  <em>Live</em>
                </span>
              )}
            </span>

            <span className="abtm-label">
              {step.label}
              <i className="abtm-underline" style={{ animationDelay: `${i * 1.1}s` }} aria-hidden="true" />
            </span>
            <span className="abtm-hint">{step.hint}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
