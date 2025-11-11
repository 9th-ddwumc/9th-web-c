import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { PAGINATION_ORDER } from "../../enums/common";
import useGetInfiniteLpComments from "../../hooks/queries/useGetInfiniteLpComments";
import LpComment from "./LpComment";
import React from "react";
import CommentListSkeletonList from "./CommentListSkeletonList";
import LpCommentForm from "./LpCommentForm";
import useGetMyInfo from "../../hooks/queries/useGetMyInfo";
import { useAuth } from "../../context/AuthContext";

interface CommentListProps {
  lpid: string; // LpDetailPage로부터 문자열 lpid를 받음
  order: PAGINATION_ORDER;
}

//특정 LP의 댓글 목록 전체를 관리하고 렌더링하는 컴포넌트
const CommentList = ({ lpid, order }: CommentListProps) => {
    const {
    data: commentsData, // commentsData: 불러온 댓글 데이터 (pages 배열 안에 각 페이지 데이터가 담김)
    fetchNextPage,
    hasNextPage,
    isPending, 
    isFetchingNextPage, 
    isError,
  } = useGetInfiniteLpComments(lpid, order); // useGetInfiniteLpComments 훅을 호출하여 댓글 데이터를 가져옴

  // 현재 로그인한 유저 정보 가져오기
  const { accessToken } = useAuth();
  const { data: me } = useGetMyInfo(accessToken);
  const meId = me?.data.id; // 현재 유저 ID (undefined일 수 있음)

  //무한 스크롤 트리거
  // useInView 훅을 사용하여 'ref' 요소가 화면에 보이는지 감지
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  // --- 무한 스크롤 실행 로직 ---
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
    // 'ref' 요소가 화면에 보이고 (inView)
    // 불러올 다음 페이지가 있으며 (hasNextPage)
    // '현재' 다음 페이지를 불러오는 중이 아니라면 (!isFetchingNextPage)
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // --- 에러 상태 처리 ---
  if (isError) {
    return (
      <p className="text-center text-red-500 py-10">
        댓글 로딩 중 오류가 발생했습니다.
      </p>
    );
  }

  //빈 상태(댓글이 없는 상태) 처리
    const isEmpty =
    !isPending && // 초기 로딩 중이 아니고
    !isFetchingNextPage && // 추가 로딩 중도 아니며,
    //commentsData가 없거나, 또는 있어도 모든 페이지(pages)의 데이터(data) 길이가 0일 때
    (!commentsData || commentsData.pages.every((page) => page.data.length === 0));
  
    return (
    <div className="space-y-6">
      {/*댓글 작성란 UI */}
      <LpCommentForm lpId={lpid} />

      {/*초기 로딩: 상단에 스켈레톤 표시 */}
      {isPending && <CommentListSkeletonList count={5} />}
    {/*빈 상태 UI */}
      {isEmpty && (
        <p className="text-center text-gray-500 py-10">
          첫 번째 댓글을 작성해보세요.
        </p>
      )}

      {/* 댓글 목록 */} 
      <div className="space-y-4">
        {commentsData?.pages.map((page, i) => (
          // 각 페이지(page)마다 React.Fragment로 감싸줍니다. (불필요한 div 방지)
          <React.Fragment key={i}>
            {/* 페이지(page) 내부의 실제 데이터 배열(page.data)을 다시 map으로 순회 */}
            {page.data.map((comment) => (
              // 각 개별 댓글(comment)을 <LpComment> 컴포넌트에 넘겨 렌더링
              <LpComment 
                key={comment.id} 
                comment={comment}
                meId={meId} 
              />
            ))}
          </React.Fragment>
        ))}
      </div>

      {/*추가 로딩: 하단에만 스켈레톤 표시 */}
      {isFetchingNextPage && <CommentListSkeletonList count={3} />}

      {/* 무한 스크롤 감지 지점 */}
      {/*
        이 div에 'ref'를 연결합니다. 사용자가 스크롤해서 이 div가 화면에 50% 이상 보이면,
        위의 'useInView' 훅이 'inView'를 true로 만들고, 'useEffect'가 실행되어 다음 페이지를 불러옵니다.
      */}
      <div ref={ref} className="h-2" />

    {/* 마지막 댓글 메시지 (댓글이 있을 때만) */}
      {!hasNextPage && !isPending && (
        <p className="text-center text-gray-500">마지막 댓글입니다.</p>
      )}
    </div>
  );
};

export default CommentList;