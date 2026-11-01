export default function Footer() {
  return (
    <footer className="app-footer">
      <p>
        <strong>Kitsu Anime Radar</strong> · Reconstruido en React 19 + TypeScript (U3 · Reactor Core)
      </p>
      <p className="footer-meta">
        Datos servidos en tiempo real por{' '}
        <a
          href="https://kitsu.docs.apiary.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Kitsu Edge API
        </a>{' '}
        · Caché local con TTL de 20 min
      </p>
    </footer>
  );
}
