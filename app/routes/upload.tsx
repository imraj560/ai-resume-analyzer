import React, {type FormEvent} from 'react';
import Navbar from "~/components/Navbar";
import {useState} from "react";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "../../constants";

const Upload = () => {
    const {auth, isLoading, fs, ai, kv} = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {

        setFile(file);

    }

    const handleAnalyze = async ({companyName, jobTitle, jobDescription, file}:{companyName: string, jobTitle: string, jobDescription: string, file: File}) => {

        setIsProcessing(true);
        setStatusText("Uploading...");

        const uploadedFile = await fs.upload([file]);
        if(!uploadedFile) return setStatusText("Error: Failed to upload file");

        setStatusText("Converting to Image...");

        const imageFile = await convertPdfToImage(file);

        console.log(imageFile)

        if(!imageFile.file) return setStatusText("Error: Failed to convert PDF to Image");

        setStatusText('Uploading image...');

        const uploadedImage = await fs.upload([imageFile.file]);

        if(!uploadedImage) return setStatusText("Error: Failed to upload image");

        setStatusText("Preparing data...");

        const uuid = generateUUID();

        const data = {

            id : uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName, jobTitle, jobDescription,
            feedback: '',
        }

        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        setStatusText('Analyzing...')

        const feedback = await ai.feedback(uploadedFile.path,prepareInstructions({jobTitle, jobDescription}));

        if(!feedback) return setStatusText("Error: Failed to analyze resume");

        const feedbackText = typeof feedback.message.content === 'string' ? feedback.message.content : feedback.message.content[0].text;

        data.feedback = JSON.parse(feedbackText);
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText('Analysis Complete, redirecting...');

        console.log(data);

    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        const form: HTMLFormElement | null = e.currentTarget.closest("form");
        if(!form) return;

        const fromData = new FormData(form);

        const companyName: FormDataEntryValue | null = fromData.get('company-name') as string;
        const jobTitle: FormDataEntryValue | null = fromData.get('job-title') as string;
        const jobDescription: FormDataEntryValue | null = fromData.get('job-description') as string;

        if(!file) return;

        handleAnalyze({companyName, jobTitle, jobDescription, file});


    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">

            <Navbar />
            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Review Your Application</h1>
                    {
                        isProcessing ? (

                            <>
                                <h2>{statusText}</h2>
                                <img

                                    src='/images/resume-scan.gif' className="w-full"
                                />
                            </>
                        ):(

                            <h2>Drop Resume for an ATS Review</h2>
                        )
                    }

                    {
                        !isProcessing && (

                            <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                                <div className="form-div">
                                    <label htmlFor="company-name">Company Name</label>
                                    <input type="text" name="company-name" id="company-name" placeholder="Company Name" />
                                </div>
                                <div className="form-div">
                                    <label htmlFor="company-name">Job Title</label>
                                    <input type="text" name="job-title" id="job-title" placeholder="Job Title" />
                                </div>
                                <div className="form-div">
                                    <label htmlFor="company-name">Job Description</label>
                                    <textarea rows={5} name="job-description" id="job-description" placeholder="Job Description" />
                                </div>
                                <div className="form-div">
                                    <label htmlFor="uploader">Upload Resume</label>
                                   <FileUploader onFileSelect={handleFileSelect} />
                                </div>

                                <button className="primary-button" type="submit">
                                    Scan Resume
                                </button>
                            </form>
                        )
                    }
                </div>
            </section>
        </main>
    );
};

export default Upload;