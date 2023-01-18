# Reanimated + Next.js 13 not working

## Related issue

[next#43886](https://github.com/vercel/next.js/issues/43886)

It's possible that Next.js' `swcPlugins` isn't working properly when using `transpilePackages`. The same goes for `next-transpile-modules`. It's not 100% clear to me whether or not this is the problem. 

What I do know is, this used to work on Next.js 12.

## Run this example

1. Clone it
2. `yarn`
3. `yarn next`

## Repro steps

These are the steps I took to make this reproduction:

1. Install dependencies

```sh
npx create-next-app reanimated
cd reanimated
yarn add react-native-web react-native-reanimated react-native-reanimated-swc-plugin raf
```

2. Add `next.config.js` with the reanimated plugin (`0.3.0` for `next@13.1.2`):

```js
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    swcPlugins: [['react-native-reanimated-swc-plugin']],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Transform all direct `react-native` imports to `react-native-web`
      'react-native$': 'react-native-web',
    }
    config.resolve.extensions = [
      '.web.js',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ]
    return config
  },
  transpilePackages: ['react-native-reanimated'],
}

module.exports = nextConfig
```

3. Add `import 'raf/polyfill'` to the top of `pages/_app.js`:

```tsx
import 'raf/polyfill'

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

4. Add a Reanimated view to `pages/index.js`:

```tsx
import Animated from 'react-native-reanimated'

export default function Home() {
  return <Animated.View />
}
```

5. Run `yarn next`, and open `localhost:3000`: it breaks


<img width="1643" alt="Screenshot 2023-01-18 at 2 42 34 PM" src="https://user-images.githubusercontent.com/13172299/213279607-e3b61934-2b06-422b-b44d-53ce7a711f6a.png">

