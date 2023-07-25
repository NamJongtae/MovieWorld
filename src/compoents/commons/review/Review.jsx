import { v4 as uuidv4 } from "uuid";
import { useContext, useEffect, useRef, useState } from "react";
import ReviewListItem from "./ReviewListItem";
import {
  Rating,
  RatingCount,
  RatingWrapper,
  ReviewList,
  SelectWrapper,
  Select,
  OpectionList,
  Opection,
  OpectionBtn,
  TextArea,
  TextAreaBtn,
  TextAreaForm,
  TextAreaLabel,
  TextAreaWrapper,
  TextCount,
  TextCountWrapper,
  Title,
  Wrapper,
  ToggleSwitch,
  ToggleButton,
  ToggleCheckbox,
  ToggleWrapper,
  ReviewCheckList,
} from "./review.style";
import {
  addReview,
  fetchAddReviewData,
  fetchFirstReview,
  fetchReviewPage,
  getUser,
} from "../../../firebase/auth";
import { Timestamp } from "firebase/firestore";
import Blank from "../blank/Blank";
import { useInView } from "react-intersection-observer";
import { UserContext } from "../../../context/userContext";

export default function Review({ movieData }) {
  const { user } = useContext(UserContext);
  const [reviewValue, setReivewValue] = useState("");
  const [rating, setRating] = useState(0);
  const [textCount, setTextCount] = useState(0);
  const [spoiler, setSpoiler] = useState(false);
  const [reviewData, setReviewData] = useState([]);
  const [userData, setUserData] = useState({});
  const [showSpoilerData, setShowSpoilerData] = useState(false);
  const [isOpenSelect, setIsOpenSelect] = useState(false);
  const [selectValue, setSelectValue] = useState("최신순");
  const [filter, setFilter] = useState({ target: "createdAt", order: "desc" });
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [page, setPage] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const limitPage = 5;

  const [ref, inview] = useInView();

  const onChangeReview = (e) => {
    if (e.target.value.length === 1 && e.target.value === " ") {
      return;
    }
    setReivewValue(e.target.value);
    setTextCount(e.target.value.length);
  };

  const onClickSelect = () => {
    setIsOpenSelect(!isOpenSelect);
  };

  const onClickOpction = (e) => {
    if (e.target.id === "new") {
      setFilter({ target: "createdAt", order: "desc" });
      setSelectValue("최신순");
      onClickSelect();
    } else if (e.target.id === "old") {
      setFilter({ target: "createdAt", order: "asc" });
      setSelectValue("등록순");
      onClickSelect();
    } else {
      setFilter({ target: "rating", order: "desc" });
      setSelectValue("평점순");
      onClickSelect();
    }
  };

  const onClickSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      const isReview = userData.reviewList.find(
        (data) => data === movieData.id
      );
      if (isReview) {
        alert("이미 리뷰한 영화 입니다!");
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
        await addReview(movieData, newReviewData);
        if (reviewData.length) {
          // 댓글 추가후 이전 데이터들도 같이 불러오기 위해서 사용(스크롤 유지)
          const { res, data } = await fetchAddReviewData(
            movieData.id,
            page,
            filter,
            showSpoilerData
          );
          setPage(res.docs[res.docs.length - 1]);
          setHasMore(res.docs.length / limitPage >= 0);
          setReviewData(data);
        } else {
          setReviewData([
            {
              ...newReviewData,
              reviewer: userData.displayName,
              reviewerImg: userData.photoURL,
            },
          ]);
        }
      }
    } else {
      alert("로그인 후 이용가능합니다!");
    }
    setReivewValue("");
    setTextCount(0);
    setRating(0);
  };

  const fecthUserData = async () => {
    if (user) {
      const data = await getUser();
      setUserData(data);
    }
  };

  const fetchFirstPage = async () => {
    const { res, data } = await fetchFirstReview(
      movieData.id,
      limitPage,
      filter,
      showSpoilerData
    );
    setReviewData(data);
    setPage(res.docs[res.docs.length - 1]);
    setHasMore(res.docs.length === limitPage);
  };

  const fetchAddData = async () => {
    const { res, data } = await fetchReviewPage(
      movieData.id,
      page,
      limitPage,
      filter,
      showSpoilerData
    );
    setReviewData((prev) => [...prev, ...data]);
    setPage(res.docs[res.docs.length - 1]);
    setHasMore(res.docs.length === limitPage);
  };

  useEffect(() => {
    fecthUserData();
  }, [reviewData]);

  // 정렬이 바뀔때 마다 데이터를 새로 받아옴
  useEffect(() => {
    fetchFirstPage();
  }, [filter, showSpoilerData]);

  useEffect(() => {
    if (hasMore && inview) {
      fetchAddData();
    }
  }, [inview]);

  return (
    <Wrapper>
      <Title>리뷰</Title>
      <ReviewCheckList>
        <RatingWrapper>
          <Rating
            count={5}
            value={rating}
            onChange={(value) => setRating(value)}
          />
          <RatingCount>{!rating || rating * 2}</RatingCount>
        </RatingWrapper>

        <ToggleWrapper>
          <ToggleCheckbox
            type="checkbox"
            id="toggle"
            className="a11y-hidden"
            onClick={() => setSpoiler(!spoiler)}
          />
          <span>스포일러 체크</span>
          <ToggleSwitch
            htmlFor="toggle"
            className="toggleSwitch"
            toggle={spoiler}
          >
            <ToggleButton
              className="toggleButton"
              toggle={spoiler}
              aria-label="스포일러 체크"
            ></ToggleButton>
          </ToggleSwitch>
        </ToggleWrapper>
      </ReviewCheckList>
      <TextAreaForm onSubmit={onClickSubmit}>
        <TextAreaWrapper>
          <TextAreaLabel className="a11y-hidden">리뷰 등록창</TextAreaLabel>
          <TextArea
            onChange={onChangeReview}
            value={reviewValue}
            placeholder="개인정보를 공용 및 요청하거나 명예훼손, 무단 광고, 불법 정보 유포시 삭제될 수 있으며, 이에 대한 민형사상 책임은 게시자에게 있습니다."
          ></TextArea>
          <TextCountWrapper>
            <TextCount>{textCount}/500</TextCount>
            <TextAreaBtn type="submit" disabled={!reviewValue || !rating}>
              작성하기
            </TextAreaBtn>
          </TextCountWrapper>
        </TextAreaWrapper>
      </TextAreaForm>

      <SelectWrapper>
        <ToggleWrapper>
          <ToggleCheckbox
            type="checkbox"
            id="toggle-showSpoiler"
            className="a11y-hidden"
            onClick={() => setShowSpoilerData(!showSpoilerData)}
          />
          <span>스포일러 리뷰 포함</span>
          <ToggleSwitch
            htmlFor="toggle-showSpoiler"
            className="toggleSwitch"
            toggle={showSpoilerData}
          >
            <ToggleButton
              className="toggleButton"
              toggle={showSpoilerData}
              aria-label="스포일러 리뷰 포함"
            ></ToggleButton>
          </ToggleSwitch>
        </ToggleWrapper>
        <Select type="button" onClick={onClickSelect} active={isOpenSelect}>
          {selectValue}
        </Select>
        {isOpenSelect && (
          <OpectionList>
            <Opection>
              <OpectionBtn type="button" id="new" onClick={onClickOpction}>
                최신순
              </OpectionBtn>
            </Opection>
            <Opection>
              <OpectionBtn type="button" id="old" onClick={onClickOpction}>
                등록순
              </OpectionBtn>
            </Opection>
            <Opection>
              <OpectionBtn type="button" id="rating" onClick={onClickOpction}>
                평점순
              </OpectionBtn>
            </Opection>
          </OpectionList>
        )}
      </SelectWrapper>

      <ReviewList>
        {reviewData.length ? (
          reviewData.map((item) => {
            return (
              <ReviewListItem
                key={item.id}
                reviewItem={item}
                reviewData={reviewData}
                reviewDataList={reviewData}
                movieId={movieData.id}
                setReviewData={setReviewData}
                userData={userData}
                setUserData={setUserData}
              />
            );
          })
        ) : (
          <Blank text={"작성된 리뷰가 없어요."} />
        )}
        <div ref={ref}></div>
      </ReviewList>
    </Wrapper>
  );
}
