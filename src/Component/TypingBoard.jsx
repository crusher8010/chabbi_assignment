import React, { useState, useEffect, useRef } from "react";
import "./TypingBoard.css";

const TypingBoard = () => {
    const [characterIndex, setCharacterIndex] = useState(0);
    const [errors, setErrors] = useState(0);
    const [timer, setTimer] = useState(null);
    const maxTime = 300;
    const [timeLeft, setTimeLeft] = useState(maxTime);
    const [isTyping, setIsTyping] = useState(false);

    const [nxtChar, setNxtChar] = useState("");

    const [tot, setTot] = useState(0);

    const typingTextRef = useRef(null);
    const inputFieldRef = useRef(null);
    const errorTagRef = useRef(null);
    const timeTagRef = useRef(null);
    const wpmTagRef = useRef(null);
    const cpmTagRef = useRef(null);

    const paragraphs = "asdfjkl;"

    useEffect(() => {
        randomParagraph();

        document.addEventListener("keydown", () => inputFieldRef.current.focus());

        return () => {
            clearInterval(timer);
            displayResults();
        };
    }, []);

    // Display Results functionality
    const displayResults = () => {
        const charactersTyped = characterIndex - errors;
        const wpm = Math.round((charactersTyped / 5 / maxTime) * 60);

        wpmTagRef.current.innerText = wpm;
    };

    //   var randomIndex = Math.floor(Math.random() * paragraphs.length);

    //Random Paragraph Functionality
    const randomParagraph = () => {
        typingTextRef.current.innerHTML = "";
        let txt = paragraphs.split("").sort(function () { return 0.5 - Math.random() }).join('')
        setTot(prev => prev + txt.length);

        txt.split("").forEach((span) => {
            let spanTag = `<span>${span}</span>`;
            typingTextRef.current.innerHTML += spanTag;
        });

        typingTextRef.current.querySelectorAll("span")[0].classList.add("active");
        setNxtChar(txt[0]);
    };

    const initTyping = (e) => {
        const characters = typingTextRef.current.querySelectorAll("span");
        let typedCharacter = inputFieldRef.current.value.split("")[characterIndex];
        const currentWordIndex = getCurrentWordIndex(characters, characterIndex);

        if (characterIndex < characters.length - 1 && timeLeft > 0) {
            if (!isTyping) {
                setTimer(setInterval(() => {
                    if (timeLeft > 0) {
                        setTimeLeft((prevTime) => prevTime - 1);
                    } else {
                        clearInterval(timer);
                        displayResults();
                    }
                }, 1000));
                setIsTyping(true);
            }

            if (typedCharacter == null) {
                setCharacterIndex(characterIndex - 1);

                if (characters[characterIndex].classList.contains("incorrect")) {
                    setErrors((prevErrors) => prevErrors - 1);
                }

                characters[characterIndex].classList.remove("correct", "incorrect");
            } else {
                if (characters[characterIndex].innerText === typedCharacter) {
                    characters[characterIndex].classList.add("correct");

                } else {
                    setErrors((prevErrors) => prevErrors + 1);
                    characters[characterIndex].classList.add("incorrect");
                }
                setCharacterIndex((prevIndex) => prevIndex + 1);

            }

            characters.forEach((span) => span.classList.remove("active"));

            characters[characterIndex + 1].classList.add("active");
            setNxtChar(characters[characterIndex + 1].innerText);

            // Highlight the words
            characters.forEach((span, index) => {
                if (index >= currentWordIndex.start && index <= currentWordIndex.end) {
                    span.classList.add("current-word");
                } else {
                    span.classList.remove("current-word");
                }
            });

            errorTagRef.current.innerText = errors;

            let wpm = Math.round(
                ((characterIndex - errors) / 5 / (maxTime - timeLeft)) * 60
            );
            wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
            wpmTagRef.current.innerText = wpm;
        } else {
            if (timeLeft <= 0) {
                console.log("bye");
                inputFieldRef.current.value = "";
                clearInterval(timer);
            } else {
                console.log("Hello")
                randomParagraph();
                inputFieldRef.current.value = "";
                setCharacterIndex(0);
            }

        }
    };

    // Reset functionality
    const resetGame = () => {
        randomParagraph();
        inputFieldRef.current.value = "";
        clearInterval(timer);
        setTimeLeft(maxTime);
        setCharacterIndex(0);
        setErrors(0);
        setIsTyping(false);
        timeTagRef.current.innerText = timeLeft;
        errorTagRef.current.innerText = errors;
        wpmTagRef.current.innerText = 0;
        cpmTagRef.current.innerText = 0;
    };

    // Current word index
    const getCurrentWordIndex = (characters, characterIndex) => {
        let currentWordIndex = { start: 0, end: 0 };
        let i = characterIndex;

        // Start index of the word
        while (i >= 0 && characters[i].innerText !== " ") {
            i--;
        }
        currentWordIndex.start = i + 1;

        i = characterIndex;

        //  End index of word
        while (i < characters.length && characters[i].innerText !== " ") {
            i++;
        }
        currentWordIndex.end = i - 1;

        return currentWordIndex;
    };

    return (
        <div>
            <h1 className="heading">Ready For Typing Challenge</h1>
            <div className="details-container">
                <div className="errors">
                    <label htmlFor="">Errors : </label>
                    <span ref={errorTagRef}>{errors}</span>
                </div>

                <div className="time">
                    <label htmlFor="">Time (sec) : </label>
                    <span ref={timeTagRef}>{timeLeft}</span>
                </div>

                <div className="wpm">
                    <label htmlFor="">WPM : </label>
                    <span ref={wpmTagRef}>{0}</span>
                </div>

                <div className="accuracy">
                    <label htmlFor="">Accuracy : </label>
                    <span>{(((tot - errors) / tot) * 100).toFixed(2)} %</span>
                </div>
            </div>

            <div className="para">
                <h2 className="text-of-typing" ref={typingTextRef}>
                    { }
                </h2>
            </div>

            <div className="Input">
                <input
                    className="input-field"
                    type="text"
                    ref={inputFieldRef}
                    onChange={initTyping}
                    placeholder="Test your speed....."
                />
            </div>

            <div className="next">
                <p>Next Character: <span className="nxtChar">{nxtChar}</span></p>
            </div>

            <button className="resettimer" onClick={resetGame}>
                Try Again
            </button>



        </div>
    );
};

export default TypingBoard;