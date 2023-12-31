import React, { useEffect } from "react";
import { Logo, SportLight, Title, Wrapper } from "./splash.style";
import { useNavigate } from "react-router-dom";
import { resolveWebp } from "../../libray/webpSupport";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/main");
    }, 2500);
  }, []);

  return (
    <>
      <Title className="a11y-hidden">스플래쉬 페이지</Title>
      <Wrapper>
        <SportLight>
          <Logo
            src={resolveWebp("/assets/webp/icon-logo.webp", "svg")}
            alt="MovieWorld"
          />
        </SportLight>
      </Wrapper>
    </>
  );
}
