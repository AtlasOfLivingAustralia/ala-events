# gbif-react-components


## Notes

It uses Node.js 24.3.0 and python to 3.10

Set python 3.10 as the default python

```
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

```
export npm_config_python=/opt/homebrew/bin/python3.10
nvm use 24.3.0
npm install
```

On macOS, if `npm install` fails to build `node-zopfli` with `fatal error: 'functional' file not found`, set `SDK` to a macOS SDK that contains the C++ headers and run:

```sh
SDK=/Library/Developer/CommandLineTools/SDKs/MacOSX27.2.sdk
SDKROOT="$SDK" CXXFLAGS="-isystem $SDK/usr/include/c++/v1" npm install
```


## Installation
Make sure you have the correct version on Node installed. We manage node versions with [nvm](https://github.com/nvm-sh/nvm). Type `nvm use` to install the required version. You can also do so manually, see `.nvmrc` for the required version.

```
npm install
```

Run the project with 
```
npm run start
```

During development it can be useful to serve and build translation files continously. To do so you should run `npm run watch-translations` and `npm run serve-translations`

Build a static storybook version with `npm run build-storybook`

Run it with `npx http-server /storybook-static`.
Notice that `serve` instead of `http-server` doesn't really work. The previews do not show then.

## Attribution

**Icons**
<a href="https://www.flaticon.com/free-icons/empty-state" title="empty state icons">Empty state icons created by Freepik - Flaticon</a>

## Build

Build for test environment.
```
npm run build:test
```
It will overwrite .env.json with .env.development.json

Build for prod

```
npm run build
```
It will overwrite .end.json with .env.production.json

## ALA Deployment

**/usr/share/nginx/html/**  is the target folder. It may change

```
copy ./ala-demo.html /usr/share/nginx/`h``tml/index.html
copy ./ala-config.js /usr/share/nginx/html/config.js
create folder: /usr/share/nginx/html/dist/lib
copy ./docker/oidc-client-ts.js /usr/share/nginx/html/dist/lib/
copy ./docker/oidc-client-ts.js.map /usr/share/nginx/html/dist/lib/
copy ./dist/lib/gbif-react-components.js /usr/share/nginx/html/dist/lib/copy
copy ./dist/lib/gbif-react-components.js.map /usr/share/nginx/html/dist/lib/
```

Issues with Node and React upgrades:
Highcharts: ✅ 10.3.3 works | ❌ 11.4.9 fails
react-apexcharts: ✅ 1.4.0 works | ❌ 1.9.0 fails

The main problem was the old Storybook/Webpack 4 toolchain combined with newer dependency versions.

Highcharts 11.4.9 failure: primarily Webpack 4 compatibility. It couldn't parse newer JavaScript syntax used by Highcharts. 10.3.3 works.
react-apexcharts 1.9.0 failure: more related to React/bundling compatibility. Its IIFE build expected React as a global, while your project uses React 17.0.2 through modules. 1.4.0 works.
