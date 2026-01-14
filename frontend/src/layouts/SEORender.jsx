import { useEffect, useRef } from "react";
import { Link, Meta, Title } from "react-meta-elements";

export default function SEORender({
  title = "HerbAura Botanica",
  description,
}) {
  const scrollRef = useRef(null);
  useEffect(() => {
    scrollRef.current?.scrollIntoView();
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <>
      <div ref={scrollRef} />
      <Title>{title}</Title>
      <Meta name="description" content={description} />
      <Link rel="canonical" href={window.location.href} />
    </>
  );
}
