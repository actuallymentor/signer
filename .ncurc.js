/* ///////////////////////////////
// .ncurc configures how ncu behaves by default
// docs: https://www.npmjs.com/package/npm-check-updates
// /////////////////////////////*/
module.exports = {
    upgrade: false,
    target: 'minor',
    doctorTest: 'npm run test:ci:with_emulator',
    reject: [
        '@rainbow-me/rainbowkit',
        'wagmi', // Upgrade wagmi only as details in @rainbow-me/rainbowkit docs: https://github.com/rainbow-me/rainbowkit/releases
        'cypress' // After cypress 11 a bunch of issues are introduced. It no longer can access non localhost:3000 urls (like emulators at localhost:8080) and doesn't allow for "cross-origin" redirects to localhost:5051
    ]
}