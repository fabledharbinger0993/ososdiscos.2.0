import Head from "next/head"
import FlyerWall from "../components/FlyerWall"

export default function Flyers() {
  return (
    <>
      <Head>
        <title>Flyers — Osos Discos</title>
        <meta name="description" content="Past and upcoming events — Osos Discos." />
      </Head>
      <FlyerWall />
    </>
  )
}
