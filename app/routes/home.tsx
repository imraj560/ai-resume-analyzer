import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import {resumes} from "../../constants";
import ResumeCard from "~/components/ResumeCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Pareson" },
    { name: "description", content: "Taylor Your Career" },
  ];
}

export default function Home() {
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">

    <Navbar />
    <section className="main-section">
      <div className="page-heading">
        <h1>Track Your Application and Resume Rating</h1>
        <h2>Leverage Ai to Taylor Your CV</h2>
      </div>
    </section>

    {
      resumes.length > 0 && (
          <div className="resumes-section">
            {
              resumes.map((resume) => {

                return(

                    <ResumeCard key={resume.id} resume={resume} />
                )

              })
            }

          </div>
        )
    }



  </main>
}
