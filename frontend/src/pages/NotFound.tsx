import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import Redacted from "../components/Redacted";

export default function NotFound() {
  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-32 text-center">
        <p className="label">Error 404</p>
        <p className="mt-4 font-display text-7xl uppercase sm:text-9xl">
          <Redacted>Nothing</Redacted> here.
        </p>
        <p className="mt-6 font-typed text-dim">This page was never filed.</p>
        <Link to="/archive" className="btn mt-10">
          Return to the archive
        </Link>
      </div>
    </Layout>
  );
}
