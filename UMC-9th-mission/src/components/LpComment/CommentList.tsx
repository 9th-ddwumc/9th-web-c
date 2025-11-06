import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { PAGINATION_ORDER } from "../../enums/common";
import useGetInfiniteLpComments from "../../hooks/queries/useGetInfiniteLpComments";
import LpCommentForm from "./LpCommentForm";
import LpComment from "./LpComment";
import React from "react";
import CommentListSkeletonList from "./CommentListSkeletonList";

interface CommentListProps {
  lpid: string;
  order: PAGINATION_ORDER;
}

const CommentList = ({ lpid, order }: CommentListProps) => {
    const {
    data: commentsData,
    fetchNextPage,
    hasNextPage,
    isPending, 
    isFetchingNextPage, 
    isError,
  } = useGetInfiniteLpComments(lpid, order); 

  //무한 스크롤 트리거
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isError) {
    return (
      <p className="text-center text-red-500 py-10">
        댓글 로딩 중 오류가 발생했습니다.
      </p>
    );
  }

  //빈 상태 처리
    const isEmpty =
    !isPending &&
    !isFetchingNextPage &&
    (!commentsData || commentsData.pages.every((page) => page.data.length === 0));
  
    return (
    <div className="space-y-6">
      {/*댓글 작성란 UI */}
      <LpCommentForm />

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
          <React.Fragment key={i}>
            {page.data.map((comment) => (
              <LpComment key={comment.id} comment={comment} />
            ))}
          </React.Fragment>
        ))}
      </div>

      {/*추가 로딩: 하단에만 스켈레톤 표시 */}
      {isFetchingNextPage && <CommentListSkeletonList count={3} />}

      {/* 무한 스크롤 감지 지점 */}
      <div ref={ref} className="h-2" />

    {/* 마지막 댓글 메시지 (댓글이 있을 때만) */}
      {!hasNextPage && !isPending && (
        <p className="text-center text-gray-500">마지막 댓글입니다.</p>
      )}
    </div>
  );
};

export default CommentList;