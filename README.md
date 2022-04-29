# family-feud-backend

Simple backend for the [Family Feud web app.](https://github.com/kevinMEH/family-feud)

## Setup

1. Clone this repository:
```
git clone https://github.com/kevinMEH/family-feud-backend
```
2. Install all dependencies:
```
npm install
```
3. Setup:
   - Create a file config.env in project root
   - Copy variables `from example.config.env` to `config.env`
   - Create files `admins.json` and `users.json` in `src`. These two files will serve as databases.*
   - Populate both files with an empty array. ( `[]` )

4. Run the express app:
```
node index.js
```

\* Since this is a small project I made in 3 days for my English project, I didn't bother integrating with an actual database. So reading and writing to JSON files will have to do.