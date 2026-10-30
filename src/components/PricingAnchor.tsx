import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const PricingAnchor = ({ id }: { id: string }) => {
  const { pathname, hash } = useLocation();
  useLayoutEffect(() => {
    if (pathname === "/" && hash === `#${id}`) {
      document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "instant" });
    }
  }, [pathname, hash, id]);
  return null;
};

export default PricingAnchor;
