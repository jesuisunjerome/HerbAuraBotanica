import { Link, Meta, Title } from "react-meta-elements";

export default function SEORender({
  title = "HerbAura Botanica",
  description,
}) {
  return (
    <>
      <Title>{title}</Title>
      <Meta name="description" content={description} />
      <Link rel="canonical" href={window.location.href} />
    </>
  );
}
