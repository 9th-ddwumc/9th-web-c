import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const PasswordInput = ({ register, name, error }: any) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      {/* input + eye icon 감싸는 div */}
      <div className="relative">
        <input
          {...register(name)}
          type={showPassword ? "text" : "password"}
          placeholder={name === "password" ? "비밀번호" : "비밀번호 확인"}
          className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
            ${error ? "border-[#ed2463] bg-[#e39db3]" : "border-gray-300"}`}
        />
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
        </span>
      </div>
      {/* 에러 메시지는 input 밖에 별도로 */}
      {error && <div className="text-red-500 text-sm">{error.message}</div>}
    </div>
  );
};

export default PasswordInput;
