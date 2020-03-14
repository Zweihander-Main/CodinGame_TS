# CodinGame - TypeScript Code

> Puzzles, Games, and Competition answers/experiments from [CodinGame](https://www.codingame.com/) -- TypeScript repo.

Other languages:

-   [JavaScript](https://github.com/Zweihander-Main/CodinGame_JS)

### List of projects:

[Coders Strike Back](./codersStrikeBack/) -- Bog programming competition. [Details here.](https://www.codingame.com/multiplayer/bot-programming/coders-strike-back) Hit Gold league. Lots more can be done to improve.

[Puzzles](./puzzles) -- Divided by difficulty. Not necessarily optimal solutions for every one but they pass.

### Tech stack:

-   TypeScript
-   [Minipack_TS](https://github.com/Zweihander-Main/minipack_ts)
-   gulp.js

### Instructions

1. Run `npm install` in the main directory (package.json should be accurate)
    - Special Notes:
    - Source/Dev: per project folder, Production: build folder
2. Run one of the commands from the [Scripts](#scripts) section. You'll most likely want `npm run watch` for development and `npm run build` for production.

### Scripts

-   `npm run build`: Create development build
-   `npm run watch`: Create development build in watch mode

### Notes

-   This was intended to be used with the [CodinGame Sync](https://chrome.google.com/webstore/detail/codingame-sync-ext/ldjnbdgcceengbjkalemckffhaajkehd) extension & app. I point the output at the pertinent flatfile generated in the build folder after running build/watch.
-   Code was run against the online tester as well as [cd-brutaltester](https://github.com/dreignier/cg-brutaltester) with local versions of the contests. For puzzles, code was either linked to the src folder or copied by hand.
-   TypeScript is bundled but NOT transpiled using simple bundler I put together: [Minipack_TS](https://github.com/Zweihander-Main/minipack_ts). This is done so that TypeScript code can be submitted to CodinGame for ranking/achievement purposes.

## Available for Hire

I'm available for freelance, contracts, and consulting both remotely and in the Hudson Valley, NY (USA) area. [Some more about me](https://www.zweisolutions.com/about.html) and [what I can do for you](https://www.zweisolutions.com/services.html).

Feel free to drop me a message at:

```
hi [a+] zweisolutions {●} com
```

## License

[MIT](./LICENSE)
