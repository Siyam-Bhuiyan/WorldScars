import { Link } from "react-router-dom";
import Ecg from "../components/Ecg";
import Layout from "../components/Layout";
import { Words } from "../components/Reveal";

export default function NotFound() {
  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-4 pb-10 pt-40 text-center">
        <p className="label">Error 404</p>
        <Ecg flat className="mx-auto mt-10 h-24 w-full text-ember" />
        <p className="mt-10 font-display text-[clamp(3.6rem,12vw,9rem)] uppercase leading-[0.85]">
          <Words text="No pulse" immediate delay={0.5} />
        </p>
        <p className="mt-2 font-serif text-[clamp(1.8rem,4vw,3rem)] italic text-ember glow">on this page.</p>
        <p className="mt-6 font-serif text-xl italic text-dim">It was never filed, or it is already gone.</p>
        <Link to="/archive" className="btn mt-12">
          Return to the archive
        </Link>
      </div>
    </Layout>
  );
}
