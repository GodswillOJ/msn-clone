import Head from 'next/head';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <title>Sign into your account</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
