import styled from "styled-components";

export const ModalWrapper = styled.section``;

export const Title = styled.h2`
  color: #fff;
  font-size: 40px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 50px;
  @media screen and (max-width: 486px) {
    font-size: 30px;
  }
`;

export const Dim = styled.div`
  width: 100%;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.7);
  inset: 0;
  z-index: 999;
`;

export const ModalCard = styled.div`
  position: fixed;
  z-index: 999;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 800px;
  background-color: #111;
  padding: 20px;
`;

export const PasswordForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  margin-bottom: 80px;
  width: 90%;
  margin: 0 auto;
  @media screen and (max-width: 486px) {
    width: 100%;
  }
`;

export const PasswordInputWrapper = styled.div``;

export const PasswordLabel = styled.label`
  display: block;
  color: #fff;
  margin-bottom: 15px;
`;

export const PasswordInput = styled.input`
  width: 100%;
  border: 2px solid #292a2b;
  background-color: #1d1e1e;
  padding: 8px;
  color: #bdbdbd;
  margin-bottom: 10px;
`;

export const InputDescList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: #4c4d4f;
  font-size: 12px;
  @media screen and (max-width: 486px) {
    font-size: 11px;
  }
`;

export const InputDesc = styled.li`
  list-style-type: disc;
  margin-left: 20px;
  line-height: 1.5;
`;

export const PasswordChangeBtns = styled.div`
  display: flex;
  gap: 10px;
  border-top: 1px solid #292a2b;
  padding-top: 20px;
`;

export const PasswordChangeBtn = styled.button`
  padding: 5px 15px;
  background-color: #1d1e1e;
  color: #fff;
  border: 1px solid #292a2b;
`;
