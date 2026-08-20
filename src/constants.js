export const LOCALITIES = [
  "Vijay Nagar", "Mukherjee Nagar", "Kamla Nagar",
  "GTB Nagar", "Shakti Nagar", "Malka Ganj", "Model Town",
  "Rana Pratap Bagh", "Roop Nagar", "Prem Nagar", "Kalyan Vihar",
  "Old Gupta Colony",
];

export const FOOD_PREFS = ["Veg Only", "Non-Veg", "Eggetarian"];
export const ROOM_TYPES = ["2 BHK", "3 BHK", "4 BHK", "5 BHK"];
export const GENDERS = ["Male", "Female", "Non-Binary"];

export const BADGE_COLORS = {
  food:       { bg: "#e8f5e9", text: "#2e7d32", border: "#a5d6a7" },
  room:       { bg: "#e3f2fd", text: "#1565c0", border: "#90caf9" },
  alcohol_yes:{ bg: "#f3e5f5", text: "#6a1b9a", border: "#ce93d8" },
  alcohol_no: { bg: "#f0f0f0", text: "#999",    border: "#ddd" },
  smoking_yes:{ bg: "#fff3e0", text: "#e65100", border: "#ffcc80" },
  smoking_no: { bg: "#f5f5f0", text: "#aaa",    border: "#e0e0d8" },
  locality:   { bg: "#faf5eb", text: "#a68a5b", border: "#e6d5b8" },
  state:      { bg: "#e8eaf6", text: "#283593", border: "#9fa8da" },
  budget:     { bg: "#e0f2f1", text: "#00695c", border: "#80cbc4" },
};

export const EMPTY_FORM = {
  name: "", phone: "", gender: "", age: "", state: "", ugDegree: "",
  courseYear: "MBA 1st Year", localities: [], roomTypes: [],
  food: "", alcohol: "", smoking: "", budget: 10000, bio: "",
};
