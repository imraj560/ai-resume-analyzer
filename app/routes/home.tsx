import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {useNavigate, Link} from "react-router";
import {useEffect, useState} from "react";
import { MdScreenSearchDesktop } from "react-icons/md";
import { MdEditDocument } from "react-icons/md";
import { BsFillSendPlusFill } from "react-icons/bs";






export function meta({}: Route.MetaArgs) {
  return [
    { title: "Pareson" },
    { name: "description", content: "Taylor Your Career" },
  ];
}

export default function Home() {

  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {

    if(!auth.isAuthenticated) navigate('/auth?next=/')

  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list('resume:*', true)) as KVItem[];

      const parsedResumes = resumes?.map((resume) => (
          JSON.parse(resume.value) as Resume
      ))

      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    }

    loadResumes()
  }, []);

  return <main className="bg-white">

    <Navbar />
    <section className="main-section">
      <div className="page-heading">
        <h1>Evaluate Your Application</h1>
        {!loadingResumes && resumes?.length === 0 ? (
            <h2>No resumes found. Upload your first resume to get feedback.</h2>
        ): (
            <h2>Leverage AI to Taylor Your Cv.</h2>
        )}

      </div>

      <div className="flex flex-row gap-80 mt-35 mb-35">

        <div className="flex flex-col items-center justify-center">
          <MdScreenSearchDesktop size={60} />
          <p className="text-[25px]">Search</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <MdEditDocument size={60} />
          <p className="text-[25px]">Analyze</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <BsFillSendPlusFill size={60} />
          <p className="text-[25px]">Send</p>

        </div>

      </div>

      {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" />
          </div>
      )}

      <div>
        <h2 className="text-[35px] font-bold">Recent Evaluation</h2>
      </div>

      {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
      )}

      {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <p>Empty Library</p>
            <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
              Upload Resume
            </Link>
          </div>
      )}



    </section>
  </main>
}
