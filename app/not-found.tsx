import Link from "next/link";
export default function NotFound() {
  return (
    <div className="page-shell empty-state">
      <span className="eyebrow">404</span>
      <h1>This one got away.</h1>
      <p>The page you’re looking for isn’t here.</p>
      <Link className="button" href="/">
        Back home
      </Link>
    </div>
  );
}
