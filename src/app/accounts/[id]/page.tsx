import AccountDetailClient from "./AccountDetailClient";

export function generateStaticParams() {
  return [{ id: "_" }];
}

export default function Page() {
  return <AccountDetailClient />;
}