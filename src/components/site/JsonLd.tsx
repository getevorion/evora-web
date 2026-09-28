import { headers } from "next/headers";

export async function JsonLd({ schema }: { schema: object | object[] }) {
  const nonce = (await headers()).get("x-csp-nonce") ?? undefined;
  const payload = Array.isArray(schema) ? schema : [schema];
  return (
    <>
      {payload.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}

export default JsonLd;
