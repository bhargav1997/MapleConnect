import api from "../services/api";

// Backup mock data in case API fails
const mockEventbriteEvents = [
   {
      _id: "683671c0d22b3eb855ac4a94",
      title: "King Charles III Addresses Canadian Parliament",
      description: "On May 27, 2025, King Charles III delivered a historic speech to Canada'''s Parliament...",
      creator: {
         _id: "6817b4109383f53902c78491",
         name: "Bhargav Suthar",
         profileImage: "https://avatars.githubusercontent.com/u/27812306?s=400&u=d61dffc0de7b805f77b47e94f0c0aa0c9907bffa&v=4",
         id: "6817b4109383f53902c78491",
      },
      startDate: "2025-06-08T02:15:00.000Z",
      endDate: "2025-06-20T02:15:00.000Z",
      location: "Ottawa, Canada",
      image: "https://www.calgary.ca/content/dam/www/csps/recreation/publishingimages/events/canada-day/canada-day-2022/canada-day-2022-16.jpg",
      isPrivate: false,
      attendees: [],
      createdAt: "2025-05-28T02:15:28.428Z",
      updatedAt: "2025-05-28T02:15:28.428Z",
      id: "683671c0d22b3eb855ac4a94",
   },
   {
      _id: "682cea6598d9974822baa703",
      title: "MapleFest 2025",
      description: "Join us for MapleFest 2025, a vibrant 4-day outdoor celebration of Canadian heritage...",
      creator: {
         _id: "6817b4109383f53902c78491",
         name: "Bhargav Suthar",
         profileImage: "https://avatars.githubusercontent.com/u/27812306?s=400&u=d61dffc0de7b805f77b47e94f0c0aa0c9907bffa&v=4",
         id: "6817b4109383f53902c78491",
      },
      startDate: "2025-05-21T20:46:00.000Z",
      endDate: "2025-05-24T20:46:00.000Z",
      location: "Stanley Park, Vancouver, British Columbia, Canada",
      image: "https://res.cloudinary.com/dtl4vdmyg/image/upload/v1747774052/events/rcqk43x3fmbb4c3vh4i7.jpg",
      group: {
         _id: "68183ea53c3056790ceb7de6",
         name: "Moose Jaw - Entertainment",
         image: "https://images.squarespace-cdn.com/content/v1/5b3469cd1aef1daafabc73bd/30a164f4-ca37-4800-98b7-f995a19b7d6d/Mac%2B%2B%2BTutor%2B28.jpg",
         id: "68183ea53c3056790ceb7de6",
      },
      isPrivate: false,
      attendees: [],
      createdAt: "2025-05-20T20:47:33.193Z",
      updatedAt: "2025-05-20T20:47:33.193Z",
      id: "682cea6598d9974822baa703",
   },
];

// Transform Eventbrite event to match our format
const transformEventbriteEvent = (event) => ({
   _id: event.id,
   title: event.name.text,
   description: event.description?.text || "",
   creator: {
      _id: event.organizer_id,
      name: event.organizer?.name || "Event Organizer",
      profileImage: event.organizer?.logo_url || null,
      id: event.organizer_id,
   },
   startDate: event.start.utc,
   endDate: event.end.utc,
   location: event.venue?.address?.localized_address_display || (event.online_event ? "Online Event" : "Location TBA"),
   image: event.logo?.url || null,
   isPrivate: false,
   attendees: [],
   createdAt: event.created,
   updatedAt: event.changed,
   id: event.id,
   status: event.status,
});

export async function searchEventbriteEvents({ location = "" }) {
   try {
      // Send request to our backend which will handle both organization events and public events
      const params = new URLSearchParams({
         location: location || "canada",
         radius: "500", // 500km radius
         startDate: new Date().toISOString(),
         endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // Next 90 days
      });

      try {
         const response = await api.get(`/eventbrite/search?${params.toString()}`);

         if (response?.data?.events?.length > 0) {
            const transformedEvents = response.data.events.map(transformEventbriteEvent);
            return {
               success: true,
               count: transformedEvents.length,
               data: transformedEvents,
            };
         }
      } catch (apiError) {
         console.warn("Eventbrite API error, falling back to mock data:", apiError);
      }

      // Fall back to mock data if API fails or returns no events
      if (!location || !location.trim()) {
         return {
            success: true,
            count: mockEventbriteEvents.length,
            data: mockEventbriteEvents,
         };
      }

      // Filter mock data by location if provided
      const searchLocation = location.trim().toLowerCase();
      const filteredEvents = mockEventbriteEvents.filter((event) => {
         const eventLocation = event.location.toLowerCase();
         return eventLocation.includes(searchLocation);
      });

      return {
         success: true,
         count: filteredEvents.length,
         data: filteredEvents,
      };
   } catch (error) {
      console.error("Error searching events:", error);
      return {
         success: false,
         count: 0,
         data: [],
      };
   }
}
