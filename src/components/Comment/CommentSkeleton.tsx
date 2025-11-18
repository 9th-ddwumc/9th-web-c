function CommentSkeleton() {
  return (
    <div className='group flex gap-4 p-5 bg-[#171717] rounded-xl relative'>
      <div className='w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-gray-700 animate-pulse'/>

      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2 mb-2'>

          <div className='h-4 w-28 rounded-md bg-gray-700 animate-pulse' />

          <span className='text-xs text-gray-600'>•</span>

          <div className='h-3 w-16 rounded-md bg-gray-700 animate-pulse' />
        </div>

        <div className='space-y-2 mt-3'>
          <div className='h-5 rounded-md bg-gray-700 animate-pulse w-full' />
        </div>
      </div>
    </div>
  );
}

export default CommentSkeleton;