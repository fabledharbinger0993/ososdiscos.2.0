import Head from "next/head"
import DJTable from "../components/DJTable"

export default function Home() {
  return (
    <>
      <Head>
        <title>Osos Discos</title>
        <meta name="description" content="Cameron Kelly & Marshall T — DJ bookings, events, and gear. Your celebration deserves a soundtrack." />
      </Head>
      <DJTable />
    </>
  )
}
