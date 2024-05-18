# COMP5347 - A2

Cartoonpia

## Getting Frontend Started

- clone/pull the code
```bash
git clone https://github.sydney.edu.au/COMP5347-COMP4347-2024/Lab-7-Group6-A2.git
```
- change direcroty to front end
 ```bash
 cd frontend
 ```
- install node_modules
```bash
npm install
#or 
sudo npm install
```
- run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Getting backend Started
- pull the code
 ```bash
cd backend
npm install
node app.js
 ```

### notation
This project involves the use of Session as well as CORS, the front-end needs to run to http://localhost:3000 and the back-end needs to run to http://localhost:3001. This is something that must be met, otherwise there may be issues with cross-domain as well as COOKIES not being transferred correctly.
