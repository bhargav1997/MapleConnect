const express = require("express");
const router = express.Router();
const eventbriteService = require("../services/eventbriteService");

// Debug middleware
router.use((req, res, next) => {
   console.log("Eventbrite route accessed:", {
      method: req.method,
      path: req.path,
      query: req.query,
      headers: req.headers,
   });
   next();
});

// Proxy endpoint for Eventbrite events search
router.get("/search", async (req, res) => {
   try {
      console.log("Received Eventbrite search request:", req.query);

      const { location, radius, startDate, endDate, query } = req.query;

      // Default radius to 10km if not provided
      const searchRadius = radius ? Number(radius) : 10;

      const result = await eventbriteService.searchEvents({
         location,
         radius: searchRadius,
         startDate,
         endDate,
         query,
         startDate: new Date().toISOString(),
      });

      console.log("Eventbrite API Response:", {
         status: response.status,
         eventCount: response.data?.events?.length || 0,
         pagination: response.data?.pagination,
      });

      res.json(response.data);
   } catch (error) {
      console.error("Eventbrite API Error:", {
         message: error.message,
         response: error.response?.data,
         status: error.response?.status,
         config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers ? "Present" : "Missing",
         },
      });
      res.status(error.response?.status || 500).json({
         error: error.response?.data?.error_description || error.message || "Failed to fetch events",
         details:
            process.env.NODE_ENV === "development"
               ? {
                    config: error.config,
                    response: error.response?.data,
                 }
               : undefined,
      });
   }
});

module.exports = router;
