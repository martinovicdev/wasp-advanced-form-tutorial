# Advanced Form app using Wasp

## Running it locally

1. Make sure you have the latest version of [Wasp](https://wasp-lang.dev) installed by running `curl -sSL https://get.wasp-lang.dev/installer.sh | sh` in your terminal.
2. Run `wasp db migrate-dev`
3. Since we are using a main.wasp.ts file, we need to run `wasp ts-setup` initially. This is a current crutch we still need to use because the TS config implementation is still not 100% where Wasp team would like it to be.
4. Run `wasp start`. This will install all dependencies and start the client and server for you :)
5. Go to `localhost:3000` in your browser (your NodeJS server will be running on port `3001`)
6. Install the Wasp extension for VSCode to get the best DX
7. Check out the docs for more info on wasp's [features](https://wasp-lang.dev/docs/language/features) and step-by-step [guides](https://wasp-lang.dev/docs)
