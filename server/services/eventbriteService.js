const axios = require("axios");

class EventbriteService {
   constructor() {
      this.apiKey = process.env.EVENTBRITE_PRIVATE_TOKEN;
      if (!this.apiKey) {
         console.error("Eventbrite Private Token not found. Please set EVENTBRITE_PRIVATE_TOKEN in your environment variables.");
      }
      this.baseUrl = process.env.EVENTBRITE_API_URL || "https://www.eventbriteapi.com/v3";

      // Log configuration (but not the full token)
      console.log("Eventbrite Configuration:", {
         baseUrl: this.baseUrl,
         tokenPresent: !!this.apiKey,
      });
   }

   async getOrganizations() {
      // First validate the token
      try {
         console.log("Validating Eventbrite token...");
         // Check if we can access the user's profile first
         const userResponse = await axios.get(`${this.baseUrl}/users/me/`, {
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${this.apiKey}`,
            },
         });

         console.log("User validation successful:", {
            id: userResponse.data.id,
            name: userResponse.data.name,
         });

         // Now try to get organizations
         console.log("Fetching organizations...");
         const response = await axios.get(`${this.baseUrl}/organizations/`, {
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${this.apiKey}`,
            },
         });

         // Log the raw response for debugging
         console.log("Organizations API Response:", {
            status: response.status,
            data: response.data,
         });

         // Validate the response structure
         if (!response.data || !response.data.organizations) {
            console.warn("Unexpected response format from Eventbrite organizations API:", response.data);
            return { organizations: [] };
         }

         // Log organizations found
         if (response.data.organizations && response.data.organizations.length > 0) {
            console.log(
               "Organizations found:",
               response.data.organizations.map((org) => ({
                  name: org.name,
                  id: org.id,
               })),
            );
         } else {
            console.log("No organizations found");
         }

         return response.data;
      } catch (error) {
         // Log detailed error information
         if (error.response) {
            console.error("Eventbrite API Error Response:", {
               endpoint: error.config.url,
               status: error.response.status,
               statusText: error.response.statusText,
               data: error.response.data,
               headers: error.config.headers,
            });
         } else if (error.request) {
            console.error("No response received from Eventbrite API:", {
               endpoint: error.config?.url,
               method: error.config?.method,
               headers: error.config?.headers,
            });
         } else {
            console.error("Error setting up Eventbrite request:", {
               message: error.message,
               config: error.config,
            });
         }

         return { organizations: [] };
      }
   }

   async searchEvents({ location, radius = 500, query = "", startDate, endDate }) {
      try {
         let allEvents = [];
         let organizationEvents = [];

         // Try to get public events first
         try {
            console.log("Fetching public events...");
            const publicResponse = await axios.get(`${this.baseUrl}/events/`, {
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${this.apiKey}`,
               },
               params: {
                  "location.address": location || "canada",
                  "location.within": `${radius}km`,
                  expand: "venue,ticket_availability,organizer",
                  status: "live",
                  start_date: startDate || new Date().toISOString(),
                  categories: "110,113,116,104",
                  page_size: 100,
               },
            });

            if (publicResponse.data?.events) {
               console.log(`Found ${publicResponse.data.events.length} public events`);
               allEvents = [...publicResponse.data.events];
            }
         } catch (publicError) {
            console.warn("Error fetching public events:", {
               status: publicError.response?.status,
               message: publicError.message,
               data: publicError.response?.data,
            });
         }

         // Then try to get organization-specific events
         try {
            console.log("Attempting to fetch organization events...");
            const orgsResponse = await this.getOrganizations();
            console.log(`Found ${orgsResponse.organizations?.length || 0} organizations`);

            if (orgsResponse.organizations?.length > 0) {
               for (const org of orgsResponse.organizations) {
                  try {
                     console.log(`Fetching events for organization: ${org.name} (${org.id})`);

                     const response = await axios.get(`${this.baseUrl}/organizations/${org.id}/events`, {
                        headers: {
                           "Content-Type": "application/json",
                           Authorization: `Bearer ${this.apiKey}`,
                        },
                        params: {
                           expand: "venue,ticket_availability,organizer",
                           status: "live",
                           start_date: startDate || new Date().toISOString(),
                           order_by: "start_asc",
                           page_size: 50,
                        },
                     });

                     if (response.data.events) {
                        organizationEvents = [...organizationEvents, ...response.data.events];
                        console.log(`Found ${response.data.events.length} events for organization ${org.name}`);
                     }
                  } catch (orgError) {
                     console.warn(`Error fetching events for organization ${org.id}:`, orgError.message);
                  }
               }
            } else {
               console.log("No organizations found for this token");
               return { events: [], count: 0 };
            }
         } catch (orgsError) {
            console.warn("Error fetching organizations:", orgsError.message);
         }

         // Filter organization events
         const filteredOrgEvents = organizationEvents.filter((event) => {
            if (!event || !event.name || !event.start || !event.end) return false;

            if (location && event.venue?.address?.localized_address_display) {
               const eventLocation = event.venue.address.localized_address_display.toLowerCase();
               const searchLocation = location.toLowerCase();
               if (!eventLocation.includes(searchLocation)) return false;
            }

            if (query) {
               const searchQuery = query.toLowerCase();
               const eventName = event.name.text.toLowerCase();
               const eventDescription = event.description?.text?.toLowerCase() || "";
               if (!eventName.includes(searchQuery) && !eventDescription.includes(searchQuery)) {
                  return false;
               }
            }

            return true;
         });

         allEvents = [...filteredOrgEvents];

         // Sort all events by start date
         allEvents.sort((a, b) => new Date(a.start.utc) - new Date(b.start.utc));

         return {
            events: allEvents,
            count: allEvents.length,
         };
      } catch (error) {
         console.error("Error searching events:", error.message);
         return {
            events: [],
            count: 0,
         };
      }
   }
}

module.exports = new EventbriteService();
