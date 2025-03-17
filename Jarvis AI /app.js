// ======= Selecting Elements =======
const btn = document.getElementById("btn");
const output = document.getElementById("output");

// ======= Speech Recognition Setup =======
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!window.SpeechRecognition) {
   alert("Speech Recognition not supported in this browser.");
}
const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = "en-US";  // English Command Input

// ======== COMMAND SYSTEM ========= //
// Add new commands here (English Command → Hindi Response)
const commands = {
   // ======== Greetings ========
   "hello": "नमस्ते! मैं आपकी कैसे सहायता कर सकती हूँ?",
   "who are you": "मैं जार्विस हूँ, आपकी वर्चुअल असिस्टेंट।",
   "how are you": "मैं हमेशा अच्छा महसूस करती हूँ, जब आप मुझसे बात करते हैं!",

   // ======== Time & Date ========
   "the time": () => {
      let time = new Date().toLocaleTimeString("hi-IN");
      return "अभी समय है " + time;
   },
   "and date": () => {
      let date = new Date().toLocaleDateString("hi-IN");
      return "आज की तारीख है " + date;
   },

   // ======== Web Commands ========
   "open google": () => {
      window.open("https://www.google.com", "_blank");
      return "गूगल खोल रही हूँ।";
   },
   "open youtube": () => {
      window.open("https://www.youtube.com", "_blank");
      return "यूट्यूब खोल रही हूँ।";
   },
   "open whatsapp": () => {
      window.open("https://web.whatsapp.com", "_blank");
      return "व्हाट्सएप खोल रही हूँ।";
   },
   "search for": (query) => {
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
      return query + " के लिए खोज रही हूँ।";
   },

   // ======== Entertainment ========
   "tell me a joke": () => {
      const jokes = [
         "अर्ज़ किया है — 'तुम्हारी स्माइल इतनी प्यारी है, दिल करता है तुम्हें वोटर आईडी बनवा दूँ!'",
         "डॉक्टर: जब तुम तनाव में होते हो तो क्या करते हो? मरीज: जी मंदिर चला जाता हूँ। डॉक्टर: बहुत अच्छा करते हो, ध्यान लगाते हो न? मरीज: जी नहीं, लोगों के जूते मिक्स कर देता हूँ फिर उनका रिएक्शन देखता हूँ।",
         "एक आदमी ने अखबार में ऐड दिया — 'बीवी चाहिए', दूसरे दिन 100 से ज़्यादा लेटर आए... सब में लिखा था — 'मेरी ले लो!'"
      ];
      let randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
      return randomJoke;
   },

   "motivate me": () => {
      const quotes = [
         "खुद पर विश्वास रखो और आगे बढ़ते रहो।",
         "तुम अविश्वसनीय चीजें करने में सक्षम हो!",
         "कभी हार मत मानो, सफलता करीब है!"
      ];
      let randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      return randomQuote;
   },

   // ======== Music Control ========
   "play music": () => {
      window.open("https://youtu.be/VTb8kQhgIhM?si=c-_HxOc5QrKSZkpl", "_blank");
      return "संगीत चला रही हूँ।";
   },
   "pause music": () => "संगीत रोक रही हूँ।",
   "next song": () => "अगला गाना चला रही हूँ।",

   // ======== Device Controls ========
   "increase volume": () => "आवाज़ बढ़ा रही हूँ।",
   "decrease volume": () => "आवाज़ कम कर रही हूँ।",
   "mute volume": () => "आवाज़ बंद कर रही हूँ।",
   "unmute volume": () => "आवाज़ चालू कर रही हूँ।",

   // ======== Utilities ========
   "set alarm": () => "अलार्म सेट कर रही हूँ। कृपया समय बताइए।",
   "open settings": () => {
      window.open("ms-settings:", "_blank");
      return "सेटिंग्स खोल रही हूँ।";
   },
   "what's the weather": () => {
      window.open("https://www.weather.com", "_blank");
      return "मौसम की जानकारी ला रही हूँ।";
   },

   // ======== Random Fun ========
   "sing a song": () => "मैं अच्छा नहीं गाती, लेकिन कोशिश करती हूँ — ला ला ला...",
   "dance for me": () => "काश मैं नाच सकती! पर मैं आपको म्यूज़िक चला सकती हूँ।"
};

// ======== MAIN LOGIC ========= //
// Mic starts when button is clicked
btn.addEventListener("click", () => {
   recognition.start();
   output.textContent = "Listening...";
});

// When speech is recognized
recognition.onresult = (event) => {
   const transcript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join("")
      .toLowerCase();
   
   output.textContent = "You said: " + transcript;
   
   if (event.results[0].isFinal) {
      processCommands(transcript);
   }
};

// When mic stops
recognition.onend = () => {
   if (output.textContent === "Listening...") {
      output.textContent = "Click the button and speak!";
   }
};

// ======== COMMAND PROCESSING ========= //
function processCommands(speechToText) {
   for (let command in commands) {
      if (speechToText.includes(command)) {
         let response;
         
         // Handling search command separately
         if (command === "search for") {
            let query = speechToText.replace(command, "").trim();
            response = commands[command](query);
         } else if (typeof commands[command] === "function") {
            response = commands[command]();
         } else {
            response = commands[command];
         }
         
         respond(response);
         return;
      }
   }
   respond("माफ कीजिए, मैं समझ नहीं पाई।");
}

// ======== RESPONSE SYSTEM ========= //
function respond(message) {
   output.textContent = message;
   speak(message);
}

// ======== SPEECH SYNTHESIS ========= //
function speak(text) {
   const utterance = new SpeechSynthesisUtterance(text);
   utterance.lang = "hi-IN";  // Hindi Response
   utterance.rate = 1;
   speechSynthesis.speak(utterance);
}
