import CarouselDetailClient from "./CarouselDetailClient";

export function generateStaticParams() {
  return [{ id: "_" }];
}

export default function Page() {
  return <CarouselDetailClient />;
}