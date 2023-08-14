import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";
import { Timestamp } from "firebase/firestore";
import ReviewFormUI from "./ReviewForm.presenter";
import { sweetToast } from "../../../sweetAlert/sweetAlert";
import { useSelector } from "react-redux";
import {
  fetchAddReview,
  fetchAddReviewData,
  fetchFirstReviewData,
} from "../../../slice/reviewSlice";
import { mypageSlice } from "../../../slice/mypageSlice";

export default function ReviewForm({
  movieData,
  reviewData,
  page,
  filter,
  dispatch,
  limitPage,
  isReview,
}) {
  const mypageData = useSelector((state) => state.mypage.data);
  const userData = useSelector((state) => state.user.data);
  const [reviewValue, setReivewValue] = useState("");
  const [rating, setRating] = useState(0);
  const [textCount, setTextCount] = useState(0);
  const [spoiler, setSpoiler] = useState(false);

  const onChangeReview = (e) => {
    if (e.target.value.length === 1 && e.target.value === " ") {
      return;
    }
    setReivewValue(e.target.value);
    setTextCount(e.target.value.length);
  };

  const onClickSubmit = async (e) => {
    e.preventDefault();
    if (userData) {
      if (isReview) {
        sweetToast("이미 리뷰한 영화입니다!", "warning");
        setReivewValue("");
        setTextCount(0);
        setRating(0);
        return;
      } else {
        const newReviewData = {
          id: uuidv4(),
          uid: userData.uid,
          rating,
          contents: reviewValue,
          createdAt: Timestamp.fromDate(new Date()),
          spoiler,
        };
        dispatch(fetchAddReview({ movieData, newReviewData }));

        if (mypageData) {
          const newData = [...mypageData, movieData];
          dispatch(mypageSlice.actions.setMypageData(newData));
        }
        if (reviewData.length) {
          // 댓글 추가후 이전 데이터들도 같이 불러오기 위해서 사용(스크롤 유지)
          dispatch(
            fetchAddReviewData({
              movieId: movieData.id,
              page,
              filter,
            })
          );
        } else {
          dispatch(
            fetchFirstReviewData({
              movieId: movieData.id,
              limitPage,
              filter,
            })
          );
        }
      }
    } else {
      sweetToast("로그인 후 이용가능합니다!", "warning");
    }
    setReivewValue("");
    setTextCount(0);
    setRating(0);
  };

  return (
    <ReviewFormUI
      rating={rating}
      setRating={setRating}
      spoiler={spoiler}
      setSpoiler={setSpoiler}
      onClickSubmit={onClickSubmit}
      onChangeReview={onChangeReview}
      reviewValue={reviewValue}
      textCount={textCount}
    />
  );
}
