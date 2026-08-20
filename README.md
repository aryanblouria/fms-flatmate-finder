# FMS Flatmate Finder 🏠

A web app for FMS Delhi MBA students to find flatmates in nearby localities. Filter by area, food preference, room type, alcohol/smoking habits, and more.

**Live Demo:** [Here](https://fms-flatmate-finder.vercel.app)

---

## Tech Stack

- **Frontend:** React 18 + Vite
- **Database:** Firebase Firestore
- **Authentication:** Firebase Authentication
- **Hosting:** Vercel
- **Fonts:** Google Fonts (Playfair Display + DM Sans)

## Project Structure

```
fms-flatmate-finder/
├── public/
│   └── favicon.png
├── src/
│   ├── assets/
│   │   └── fms-logo.png
│   ├── components/
│   │   ├── Badge.jsx
│   │   ├── FilterSelect.jsx
│   │   ├── InputField.jsx
│   │   ├── MultiSelectChips.jsx
│   │   ├── ProfileCard.jsx
│   │   └── ToggleButton.jsx
│   ├── App.jsx            # Main application
│   ├── constants.js       # Localities, options, config
│   ├── firebase.js        # Firebase init + CRUD functions
│   ├── index.css          # Global styles
│   └── main.jsx           # React entry point
├── .env.example
├── .gitignore
├── firestore.rules        # Firestore security rules
├── index.html
├── package.json
├── vercel.json
└── vite.config.js
```

---

## License

MIT — built for FMS Delhi students.
