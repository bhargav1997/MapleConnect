const { pipeline } = require("@xenova/transformers");

let sentimentClassifier = null;
let toxicityClassifier = null;

async function initializeClassifiers() {
   try {
      console.log("Initializing sentiment classifier...");
      sentimentClassifier = await pipeline('sentiment-analysis');
      console.log("Initializing toxicity classifier...");
      toxicityClassifier = await pipeline("text-classification");
      console.log("Classifiers initialized successfully");
   } catch (error) {
      console.error("Error initializing classifiers:", error);
   }
}

function analyzeSentiment(text) {
   if (!sentimentClassifier) {
      return Promise.resolve({ mood: "NEUTRAL", confidence: 0, original: null });
   }
   return sentimentClassifier(text)
      .then((result) => ({
         mood: result[0].label.toLowerCase(),
         confidence: result[0].score,
         original: result[0],
      }))
      .catch((error) => {
         console.error("Error analyzing sentiment:", error);
         return { mood: "NEUTRAL", confidence: 0, original: null };
      });
}

function detectToxicity(text) {
   if (!toxicityClassifier) {
      return Promise.resolve({ isToxic: false, confidence: 0, original: null });
   }
   return toxicityClassifier(text)
      .then((result) => ({
         isToxic: result[0].label === "toxic",
         confidence: result[0].score,
         original: result[0],
      }))
      .catch((error) => {
         console.error("Error detecting toxicity:", error);
         return { isToxic: false, confidence: 0, original: null };
      });
}

// Initialize classifiers when the service starts
initializeClassifiers().catch(console.error);

module.exports = {
   analyzeSentiment,
   detectToxicity,
};
