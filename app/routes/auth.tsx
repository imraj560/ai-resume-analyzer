import React, {useEffect} from 'react';
import type {Route} from "../../.react-router/types/app/routes/+types/home";
import {usePuterStore} from "~/lib/puter";
import {useLocation, useNavigate} from "react-router";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Pareson | Auth" },
        { name: "description", content: "Log In" },
    ];
}

const Auth = () => {

    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const next :string = location.search.split('next')[1];
    const navigate = useNavigate();

    useEffect(() => {

        if(auth.isAuthenticated) navigate(next)

    }, [auth.isAuthenticated, next]);


    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex items-center justify-center">
            <div className="gradient-border shadow-lg">
                <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1>Hello</h1>
                        <h2>Login to Review</h2>
                    </div>

                    <div>
                        {isLoading ? (

                            <button className="auth-button animate-pulse">
                                <p>Signing you in..</p>
                            </button>

                        ):(
                            <>
                                {
                                    auth.isAuthenticated ? (

                                        <button className="auth-button" onClick={auth.signOut}>
                                          <p>Log Out</p>
                                        </button>
                                    ):(

                                        <button className="auth-button" onClick={auth.signIn}>
                                            <p>Log In</p>
                                        </button>
                                    )
                                }
                            </>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Auth;