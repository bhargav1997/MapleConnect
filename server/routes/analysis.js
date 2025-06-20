const express = require("express");
const { protect } = require("../middleware/auth");
const { analyzeSentiment, detectToxicity } = require("../services/textAnalysis");

const router = express.Router();

// Protect all routes
router.use(protect);

// @route   POST /api/analysis/sentiment
// @desc    Analyze text sentiment
// @access  Private
router.post("/sentiment", async (req, res) => {
   try {
      const { text } = req.body;
      if (!text) {
         return res.status(400).json({
            success: false,
            error: "Please provide text to analyze",
         });
      }

      const result = await analyzeSentiment(text);
      res.json({
         success: true,
         data: result,
      });
   } catch (error) {
      console.error("Error analyzing sentiment:", error);
      res.status(500).json({
         success: false,
         error: "Failed to analyze sentiment",
      });
   }
});

// @route   POST /api/analysis/toxicity
// @desc    Check text for toxicity
// @access  Private
router.post("/toxicity", async (req, res) => {
   try {
      const { text } = req.body;
      if (!text) {
         return res.status(400).json({
            success: false,
            error: "Please provide text to analyze",
         });
      }

      const result = await detectToxicity(text);
      res.json({
         success: true,
         data: result,
      });
   } catch (error) {
      console.error("Error detecting toxicity:", error);
      res.status(500).json({
         success: false,
         error: "Failed to detect toxicity",
      });
   }
});

module.exports = router;
