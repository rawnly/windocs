# Windocs
> A nice looking swagger alternative. Powered by Tailwind

## Usage
- Clone the repo,
- Create a `.env` file with `SWAGGER_URL` pointing to a valid OpenAPI json (must be an HTTP url).
- build it (`npm run build`) and start the server (`npm start`)


## Caveats / TODO
- [ ] Missing `ENUM` support
- [ ] Missing `additionalProperties` support.
- [ ] UI/UX can be improved a lot
- [ ] Auto open menu sections while scrolling (see ReDoc)
- [ ] Sometimes the body isn't correctly formatted.
- [ ] Add some info about the response type and consumation.
- [ ] Add Auth support
- [ ] Add "Try It" button.
- [ ] Code samples
- [ ] Dynamically generate basic HTTP code samples.
