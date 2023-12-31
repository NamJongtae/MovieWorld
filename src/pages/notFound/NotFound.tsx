import React from "react";
import { BackBtn, ErrorImg, ErrorText, Title, Wrapper } from "./notFound.style";
import { useNavigate } from "react-router-dom";
import { resolveWebp } from "../../libray/webpSupport";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Title className="a11y-hidden">404 Error</Title>
      <ErrorImg
        src={resolveWebp("/assets/webp/icon-404.webp", "svg")}
        alt="404 Error"
      />
      <ErrorText>페이지를 찾을 수 없습니다.</ErrorText>
      <BackBtn type="button" onClick={() => navigate(-1)}>
        이전 페이지
      </BackBtn>
    </Wrapper>
  );
}
