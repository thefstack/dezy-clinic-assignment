import Head from 'next/head';
import ChatWindow from '@/components/ChatWindow';

export default function Home() {
  return (
    <>
      <Head>
        <title>Dezy Clinic Assistant</title>
      </Head>
      <main className="min-h-screen bg-gray-100">
        <h1 className="text-3xl text-center pt-10 font-bold">Dezy Clinic Assistant</h1>
        <ChatWindow />
      </main>
    </>
  );
}
