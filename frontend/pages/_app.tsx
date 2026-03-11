import type { AppProps } from "next/app"
import Head from "next/head"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { useTheme } from "../hooks/useTheme"
import "../styles/globals.css"

export default function App({ Component, pageProps }: AppProps) {
  useTheme()

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Component {...pageProps} />
      <SpeedInsights />
    </>
  )
}
