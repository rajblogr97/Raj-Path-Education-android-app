import React from 'react';
import Card from './Card';

const CodeBlock: React.FC<{ children: React.ReactNode, language?: string }> = ({ children, language }) => (
    <pre className={`bg-slate-800 text-white p-4 rounded-lg my-2 text-sm overflow-x-auto relative`}>
        {language && <span className="absolute top-2 right-2 text-xs text-gray-400">{language}</span>}
        <code>{children}</code>
    </pre>
);

const Step: React.FC<{ number: number; title: string; children: React.ReactNode }> = ({ number, title, children }) => (
    <div className="flex gap-4">
        <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-8 h-8 bg-royal-blue text-white rounded-full font-bold">
                {number}
            </div>
            <div className="flex-1 w-px bg-gray-300 my-2"></div>
        </div>
        <div className="pb-8 flex-1">
            <h3 className="text-xl font-bold text-royal-blue mb-2">{title}</h3>
            <div className="text-gray-700 space-y-3">{children}</div>
        </div>
    </div>
);

const HostingGuide: React.FC = () => {
    return (
        <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-royal-blue mb-4">Introduction</h2>
            <p className="text-gray-700 mb-6">
                Netlify ek modern web hosting platform hai jo developers ke liye app deploy karna bahut aasan banata hai. Is guide se aap apne 'Raj Path' project ko free me live kar sakte hain.
            </p>

            <h2 className="text-2xl font-semibold text-royal-blue mb-4">Zaroori Cheezein (Prerequisites)</h2>
            <ul className="list-disc list-inside text-gray-700 mb-8 space-y-2">
                <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-royal-blue hover:underline font-semibold">GitHub</a>, GitLab, ya Bitbucket par ek account.</li>
                <li><a href="https://netlify.com" target="_blank" rel="noopener noreferrer" className="text-royal-blue hover:underline font-semibold">Netlify</a> par ek free account.</li>
                <li>Is project ka code aapke GitHub repository me push kiya hua hona chahiye.</li>
            </ul>

            <div className="relative">
                <Step number={1} title="Nayi Netlify.toml file add karein">
                    <p>
                        Project ke root folder me ek nayi file banayein jiska naam ho <code>netlify.toml</code>. Yeh file Netlify ko batati hai ki aapka project kaise build karna hai.
                    </p>
                    <p>Is file me neeche diya gaya code copy-paste karein:</p>
                    <CodeBlock language="toml">{`[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  # Compatibility ke liye Node.js ka version set karein
  NODE_VERSION = "18"`}</CodeBlock>
                    <p className="text-sm text-gray-500">Yeh file aapke liye pehle se add kar di gayi hai.</p>
                </Step>

                <Step number={2} title="Redirects file set up karein">
                    <p>
                        React Router jaisi libraries ke liye, Netlify ko batana zaroori hai ki saare page requests ko <code>index.html</code> par bheje. Iske liye ek special file ki zaroorat hoti hai.
                    </p>
                    <p>
                        Aapke project me, ek <code>public</code> folder banayein (agar pehle se nahi hai) aur uske andar ek file banayein jiska naam ho <code>_redirects</code> (bina kisi extension ke).
                    </p>
                     <p>Is file me neeche di gayi line add karein:</p>
                    <CodeBlock>{`/*    /index.html   200`}</CodeBlock>
                     <p className="text-sm text-gray-500">Yeh file bhi aapke liye add kar di gayi hai.</p>
                </Step>
                
                <Step number={3} title="Netlify par Nayi Site Banayein">
                    <p>
                        Apne Netlify account me login karein aur "Add new site" &rarr; "Import an existing project" par click karein.
                    </p>
                    <p>
                        Apna Git provider (jaise GitHub) connect karein aur apni 'Raj Path' project ki repository chunein.
                    </p>
                </Step>

                <Step number={4} title="Environment Variable Set Karein (Bahut Zaroori!)">
                    <p>
                        Aapka app Gemini API ka istemal karta hai, jiske liye ek API Key ki zaroorat hai. Yeh key secret rakhni chahiye.
                    </p>
                    <p>
                        Netlify ke site settings me, yahan jayein:
                    </p>
                    <p className="p-2 bg-slate-100 border rounded-md text-sm">
                        <strong>Site configuration &rarr; Build & deploy &rarr; Environment &rarr; Environment variables</strong>
                    </p>
                    <p>
                        "Add a variable" par click karein aur neeche di gayi details bharein:
                    </p>
                    <ul className="list-disc list-inside pl-4 mt-2">
                        <li><strong>Key:</strong> <code>API_KEY</code></li>
                        <li><strong>Value:</strong> <code>[Yahan apni Gemini API Key paste karein]</code></li>
                    </ul>
                     <p className="mt-2 text-sm font-semibold text-red-600">Dhyan dein: Apni API key ko code me ya public repository me kabhi na rakhein.</p>
                </Step>

                <Step number={5} title="App ko Deploy Karein">
                    <p>
                        Environment variable set karne ke baad, "Deploy site" button par click karein.
                    </p>
                    <p>
                        Netlify aapke code ko repository se lega, build karega (<code>npm run build</code> command use karke), aur live host kar dega.
                    </p>
                    <p>
                       Kuch hi minutes me, aapki site live ho jayegi aur aapko ek unique URL mil jayega (jaise <code>random-name-12345.netlify.app</code>).
                    </p>
                </Step>
            </div>
             <div className="mt-8 text-center bg-green-50 border border-green-200 p-4 rounded-lg">
                <h3 className="text-xl font-bold text-green-800">Badhai ho! 🥳</h3>
                <p className="text-green-700 mt-1">Aapka Raj Path app ab Netlify par live hai. Aap is URL ko kisi ke bhi saath share kar sakte hain.</p>
            </div>
        </Card>
    );
};

export default HostingGuide;
