import { signInWithKakaoAction } from "../actions";
import Button from "@/shared/ui/button";

export default function KakaoLoginButton() {
  return (
    <form action={signInWithKakaoAction}>
      <Button type="submit" variant="secondary" className="w-full">
        Kakao로 로그인
      </Button>
    </form>
  );
}
