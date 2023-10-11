# HSA Eligibility Take Home Project

Completed by: 

Michael Tutt
tutt.michael@gmail.com

## Technologies Used

- [Next.js 13](https://nextjs.org/docs/getting-started)
- [NextUI v2](https://nextui.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)

## How to Use

### Setup API Key

Create an `.env.local` file in the root of your local version of the repository. Add the variable `AIRTABLE_API_KEY` with the associated key. Example below:

```
AIRTABLE_API_KEY=[YOUR_API_KEY]
```

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Navigate browser to local endpoint

Open localhost:3000 within your preferred browser (this project was tested using Chrome).

## Getting Project Production Ready

In order to ensure this project is more production ready there are a few follow-up tasks I would complete:

First, I would make the component more modular for reuse and ensure it has the more typical suite of UI features required for properly displaying tables of data. These features could include:
- Pagination that only fetches initial data and each subsequent page as you navigate
- Allow sort and search within the table, where applicable
- Add standard internationalization of currencies and dates based on the User's browser settings or current location
- Mobile friendly viewing

Second, I would want to confirm the app is optimized for the intial page load and make sure user's feel they're using a high quality app that provides data quickly and effectively. A few improvments to be made that would ensure this happens:
- Optimize images and set up compression (G-Zip)
- Minify/uglify JavaScript and CSS code to reduce file size
- Selectively choose to render only critical information on the server and load ancillary data asynchronously

