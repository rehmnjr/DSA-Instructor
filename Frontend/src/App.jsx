import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import * as THREE from 'three';

const VANTA_CDN_NET = "https://cdn.jsdelivr.net/gh/tengbao/vanta@latest/dist/vanta.net.min.js";

const App = () => {
  const [que, setQue] = useState("");
  const [userMsg, setUserMsg] = useState('');
  const [answer, setAnswer] = useState('');

  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  useEffect(() => {
    if (!window.VANTA) {
      const script = document.createElement("script");
      script.src = VANTA_CDN_NET;
      script.async = true;
      script.onload = () => {
        initVanta();
      };
      document.body.appendChild(script);
    } else {
      initVanta();
    }

    function initVanta() {
      if (!vantaEffect.current && window.VANTA) {
        vantaEffect.current = window.VANTA.NET({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0xff3cac,
          backgroundColor: 0x111111,
        });
      }
    }

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  const handleChange = (e) => setQue(e.target.value);

  const handkeClick = async () => {
    setUserMsg(que);
    const res = await fetch(`http://localhost:8000/answer?question=${encodeURIComponent(que)}`);
    const data = await res.json();
    setAnswer(data.answer);
    setQue('');
  };

  return (
    <div
      ref={vantaRef}
      className="min-h-screen w-full text-white flex flex-col items-center px-4 py-10 relative"
    >
      {/* Transparent overlay BELOW foreground content */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none z-10"></div>

      {/* Foreground content ABOVE overlay */}
      <div className="relative z-20 w-full max-w-3xl flex flex-col gap-10">
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-center mt-10 mb-10">
          Hello, I'm Your <br /> Data Structure & Algorithm Instructor
        </h1>

        <div className="w-full flex flex-col gap-10">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={que}
              onChange={handleChange}
              placeholder="Enter your question"
              className="flex-1 border border-gray-600 p-2 rounded bg-black/70 focus:outline-none focus:ring-2 focus:ring-fuchsia-800"
            />
            <button
              className="px-6 py-2 bg-green-700 hover:bg-green-800 rounded text-white transition"
              onClick={handkeClick}
            >
              Run
            </button>
          </div>

          <div className="bg-black/70 w-full border border-gray-600 p-4 rounded">
            <ul className="flex flex-col gap-6">
              <div className="flex flex-col items-end">
                <li className="bg-gradient-to-r from-fuchsia-900 to-blue-800 py-2 px-4 rounded-md max-w-full sm:max-w-[80%] break-words">
                  {userMsg}
                </li>
                <span className="text-sm text-gray-400">:User</span>
              </div>

              <div className="flex flex-col items-start">
                <span className="text-sm text-gray-400 mb-1">DSA Bot:</span>
                <li className="bg-gradient-to-r from-fuchsia-900 to-blue-800 py-2 px-4 rounded-md max-w-full sm:max-w-[80%] break-words">
                  <ReactMarkdown
                    children={answer}
                    components={{
                      code({ inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  />
                </li>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
