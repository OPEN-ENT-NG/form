module.exports = {
    "transform": {
        ".(ts|tsx)": "/node_modules/ts-jest/preprocessor.js"
    },
    "testRegex": "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js"
    ],
    "moduleNameMapper": {
        '^axios$': require.resolve('axios'),
    },
    "testPathIgnorePatterns": [
        "/node_modules/",
        "/build/",
        "/out/"
    ],
    "verbose": true,
    "testURL": "http://localhost/",
    "coverageDirectory": "coverage/front",
    "coverageReporters": [
        "text",
        "cobertura"
    ],
    "moduleNameMapper": {
        "^@formulaire(.*)$": "/src/ts$1"
    }
};
