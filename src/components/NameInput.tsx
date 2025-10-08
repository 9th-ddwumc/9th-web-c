import type { UseFormRegister, FieldError } from "react-hook-form";
import { CgProfile } from "react-icons/cg";

interface NameInputProps {
  register: UseFormRegister<any>;
  error?: FieldError;
}

const NameInput = ({ register, error }: NameInputProps) => {
  return (
    <>
      <div><CgProfile size={120} /></div>
      <input
        {...register("name")}
        type="text"
        placeholder="닉네임을 입력해 주세요."
        className={`border w-[300px] p-[10px] rounded-sm focus:border-[#807bff] ${
          error ? "border-red-500 bg-red-200" : "border-gray-300"
        }`}
      />
      {error && <div className="text-red-500 text-sm">{error.message}</div>}
    </>
  );
};

export default NameInput;