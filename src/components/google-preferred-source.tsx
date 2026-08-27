import Script from "next/script";

export default function GooglePreferredSource() {
  return (
    <>
      <div className="google-preferred-source" aria-label="Prefer this site on Google">
        <div className="google-preferred-source__button" google-add-preferred-source-btn="" data-theme="light" />
      </div>
      <Script id="google-preferred-source" src="https://news.google.com/swg/js/v1/publisher.js" strategy="afterInteractive" />
    </>
  );
}
