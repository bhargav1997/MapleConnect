import api from "./api";

export const analyzeSentiment = async (text) => {
   const response = await api.post("/analysis/sentiment", { text });
   return response.data;
};

export const detectToxicity = async (text) => {
   const response = await api.post("/analysis/toxicity", { text });
   return response.data;
};
